// Controlla le regole di integrità del modello che `reqvire validate` e `reqvire lint` non coprono:
// - requisiti, contratti e verifiche senza date né storia delle decisioni, fuori da citazioni e codice;
// - enunciati dei requisiti e testi dei contratti senza formule non normative;
// - contratti senza alternative né motivazioni, che stanno nei Details del requisito proprietario;
// - ogni verifica di ispezione, analisi o dimostrazione indica «Non automatizzabile:»;
// - ogni file di governo tracciato da Git in ciascun repository del modello è riferito dal modello.
// Il modello è unico e comprende ogni repository dello spazio di lavoro che contiene system-model/.
// Uso: node scripts/check-model.mjs [workspace] [specchio], con workspace predefinito la cartella che
// contiene ambrogio-model; Reqvire legge lo specchio dei file visibili a Git preparato da
// scripts/model-checks, se indicato, altrimenti la cartella di lavoro. Reqvire gira alla versione di ambrogio-model/.reqvire-version. Esce con stato 1 se
// trova violazioni.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const modelRepo = fileURLToPath(new URL('..', import.meta.url));
const workspace = resolve(process.argv[2] ?? join(modelRepo, '..'));
const reqvireWorkspace = resolve(process.argv[3] ?? workspace);
const pinned = readFileSync(join(modelRepo, '.reqvire-version'), 'utf8').trim();
const reqvirePackage = pinned.includes('@') ? pinned : `@reqvire-org/reqvire@${pinned}`;
if (!pinned || /@(latest|next)$/.test(reqvirePackage)) {
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

// Dentro un hook Git le variabili GIT_* puntano al repository del commit: si tolgono per leggere ogni repository.
const gitEnvironment = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')));
const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', env: gitEnvironment });
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
  for (const path of git(join(workspace, repository), 'ls-files').split('\n').filter(Boolean)) {
    if (governed.some(pattern => pattern.test(path)) && !referenced.has(`${repository}/${path}`)) {
      violations.push(`file di governo non riferito dal modello: ${repository}/${path}`);
    }
  }
}

for (const violation of violations) console.log(violation);
console.error(`${violations.length} violazioni dell'integrità del modello`);
process.exit(violations.length > 0 ? 1 : 0);
