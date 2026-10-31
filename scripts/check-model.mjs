// Controlla le regole di integrità del modello che `reqvire validate` e `reqvire lint` non coprono:
// - requisiti, contratti e verifiche senza date né storia delle decisioni, fuori da citazioni e codice;
// - enunciati dei requisiti e testi dei contratti senza formule non normative;
// - contratti senza alternative né motivazioni, che stanno nei Details del requisito proprietario;
// - ogni verifica di ispezione, analisi o dimostrazione indica «Non automatizzabile:»;
// - ogni contratto citato tra «» da un contratto di un altro requisito è nelle Contract References del proprietario;
// - ogni requisito implementato ha una verifica e ogni sua verifica di test ha satisfiedBy;
// - ogni file di governo tracciato da Git in ciascun repository del modello è riferito dal modello.
// Il modello è unico e comprende ogni repository dello spazio di lavoro che contiene system-model/.
// Uso: node scripts/check-model.mjs [workspace] [specchio] [--staged repository indice], con workspace predefinito la cartella che
// contiene ambrogio-model; Reqvire legge lo specchio dei file visibili a Git preparato da
// scripts/model-checks, se indicato, altrimenti la cartella di lavoro. Con --staged i file di governo del
// repository del commit sono quelli del file indice indicato, cioè il contenuto che sta per essere committato. Reqvire gira alla versione di ambrogio-model/.reqvire-version. Esce con stato 1 se
// trova violazioni.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const modelRepo = fileURLToPath(new URL('..', import.meta.url));
const workspace = resolve(process.argv[2] ?? join(modelRepo, '..'));
const reqvireWorkspace = resolve(process.argv[3] ?? workspace);
const stagedAt = process.argv.indexOf('--staged');
const staged = stagedAt > 0 ? { repository: realpathSync(process.argv[stagedAt + 1]), index: resolve(process.argv[stagedAt + 2]) } : undefined;
const pinned = readFileSync(join(modelRepo, '.reqvire-version'), 'utf8').trim();
const reqvirePackage = pinned.includes('@') ? pinned : `@reqvire-org/reqvire@${pinned}`;
// Una versione esatta dopo il nome del pacchetto: MAJOR.MINOR.PATCH con un eventuale suffisso di pre-release.
if (!/^@?[^@\s]+@\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/u.test(reqvirePackage)) {
  console.error(`versione di Reqvire non fissata in ${join(modelRepo, '.reqvire-version')}`);
  process.exit(1);
}
const reqvire = (...args) => execFileSync('npx', ['--yes', reqvirePackage, '--workspace', reqvireWorkspace, ...args], {
  encoding: 'utf8',
  maxBuffer: 256 * 1024 * 1024,
  env: { ...process.env, npm_config_loglevel: 'error' },
});

const contractTypes = ['specification', 'constraint', 'behavior', 'input-output', 'state'];
const manualTypes = ['inspection-verification', 'analysis-verification', 'demonstration-verification'];
const verificationTypes = ['test-verification', ...manualTypes];
const months = 'gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre'
  + '|January|February|March|April|May|June|July|August|September|October|November|December';
const history = new RegExp(`\\b\\d{4}-\\d{2}-\\d{2}\\b|\\b\\d{1,2} (?:${months}) \\d{4}\\b`
  + '|\\b(?:concordat[ao]|decis[ao]|scelt[ao])(?: con la persona)? il\\b|\\b(?:agreed|decided) on\\b', 'iu');
const modal = /(?<![\p{L}\p{N}_])(?:può|possono|potrebbe|potrebbero|dovrebbe|dovrebbero|eventualmente|may|might|could|should|possibly)(?![\p{L}\p{N}_])/giu;
const rationale = /\bAlternative (?:considerate|e conseguenze)\b/iu;
const quoted = /`[^`]*`|«[^»]*»|"[^"\n]*"|“[^”]*”/gu;
const governed = [
  /^\.github\/(?!.*\.(?:svg|png|jpe?g|gif|webp|ico)$)/,
  /^\.githooks\//,
  /^scripts\//,
  /(^|\/)Dockerfile[^/]*$/,
  /(^|\/)compose[^/]*\.ya?ml$/,
  /(^|\/)\.dockerignore$/,
  /(^|\/)\.gitignore$/,
  /(^|\/)\.gitleaksignore$/,
  /(^|\/)\.npmrc$/,
  /(^|\/)package\.json$/,
  /^pnpm-workspace\.yaml$/,
  /(^|\/)tsconfig[^/]*\.json$/,
  /(^|\/)vitest[^/]*\.config\.[^/]+$/,
];

const allElements = Object.values(JSON.parse(reqvire('search', '--json')).files).flatMap(file => file.elements);
const elements = type => allElements.filter(element => element.type === type);
const statement = element => element.content.split('#### Details')[0];
const unquoted = text => text.replace(quoted, '');

const violations = [];
const requirements = elements('requirement');
const contracts = contractTypes.flatMap(elements);
const verifications = verificationTypes.flatMap(elements);

for (const element of [...requirements, ...contracts, ...verifications]) {
  if (history.test(unquoted(element.content))) {
    violations.push(`storia delle decisioni: ${element.name} (${element.file})`);
  }
}
for (const [element, text] of [
  ...requirements.map(element => [element, statement(element)]),
  ...contracts.map(element => [element, element.content]),
]) {
  for (const [word] of unquoted(text).matchAll(modal)) {
    violations.push(`formula non normativa «${word}»: ${element.name} (${element.file})`);
  }
}
for (const element of contracts) {
  if (/^#### Alternative/mu.test(element.content) || rationale.test(unquoted(element.content))) {
    violations.push(`alternative o motivazioni nel contratto: ${element.name} (${element.file})`);
  }
}
for (const element of verifications.filter(element => manualTypes.includes(element.type))) {
  if (!element.content.includes('Non automatizzabile:')) {
    violations.push(`verifica manuale senza «Non automatizzabile:»: ${element.name} (${element.file})`);
  }
}

const targets = (element, type) => element.relations
  .filter(relation => relation.relation_type === type)
  .map(relation => relation.target.target);
const byIdentifier = new Map(allElements.map(element => [element.identifier, element]));
const contractsByName = Map.groupBy(contracts, element => element.name);
for (const contract of contracts) {
  const owners = targets(contract, 'define');
  const cited = new Set([...contract.content.replace(/`[^`]*`/gu, '').matchAll(/«([^«»]+)»/gu)].map(match => match[1]));
  for (const name of cited) {
    for (const dependency of contractsByName.get(name) ?? []) {
      if (dependency === contract) continue;
      for (const owner of owners.filter(owner => !targets(dependency, 'define').includes(owner))) {
        const requirement = byIdentifier.get(owner);
        const declared = [...(requirement?.contract_references ?? []), ...(requirement?.contract_bindings ?? [])];
        if (requirement && !declared.includes(dependency.identifier)) {
          violations.push(`dipendenza fra contratti non dichiarata: ${requirement.name} non riferisce «${name}», citato da ${contract.name} (${contract.file})`);
        }
      }
    }
  }
}

const implemented = new Set(requirements.filter(element => targets(element, 'satisfiedBy').length > 0).map(element => element.identifier));
const verified = new Set();
for (const verification of verifications) {
  const verifiedImplemented = targets(verification, 'verify').filter(target => implemented.has(target));
  verifiedImplemented.forEach(target => verified.add(target));
  if (verifiedImplemented.length > 0 && verification.type === 'test-verification' && targets(verification, 'satisfiedBy').length === 0) {
    violations.push(`verifica di test di un requisito implementato senza satisfiedBy: ${verification.name} (${verification.file})`);
  }
}
for (const requirement of requirements.filter(element => implemented.has(element.identifier) && !verified.has(element.identifier))) {
  violations.push(`requisito implementato senza verifica: ${requirement.name} (${requirement.file})`);
}

// Dentro un hook Git le variabili GIT_* puntano al repository del commit: si tolgono per leggere ogni repository.
const gitEnvironment = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')));
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', env: gitEnvironment });
// Il repository del commit si legge dal suo file indice, gli altri dal proprio indice predefinito.
const trackedFiles = dir => execFileSync('git', ['-C', dir, 'ls-files'], {
  encoding: 'utf8',
  env: staged && realpathSync(dir) === staged.repository ? { ...gitEnvironment, GIT_INDEX_FILE: staged.index } : gitEnvironment,
});
const isModelRepository = dir => {
  if (!existsSync(join(dir, 'system-model'))) return false;
  try {
    return realpathSync(git(dir, 'rev-parse', '--show-toplevel').trim()) === realpathSync(dir);
  } catch {
    return false;
  }
};
const repositories = readdirSync(workspace, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && isModelRepository(join(workspace, entry.name)))
  .map(entry => entry.name);
const referenced = new Set(JSON.parse(reqvire('resources')).relations.map(relation => relation.file_path));
for (const repository of repositories) {
  for (const path of trackedFiles(join(workspace, repository)).split('\n').filter(Boolean)) {
    if (governed.some(pattern => pattern.test(path)) && !referenced.has(`${repository}/${path}`)) {
      violations.push(`file di governo non riferito dal modello: ${repository}/${path}`);
    }
  }
}

for (const violation of violations) console.log(violation);
console.error(`${violations.length} violazioni dell'integrità del modello`);
process.exit(violations.length > 0 ? 1 : 0);
