# Elements

### Audit delle dipendenze con pnpm

Il job dei controlli della CI di ogni repository di prodotto esegue `pnpm audit --audit-level high` nella cartella del repository, dopo l'installazione congelata delle dipendenze e prima del controllo TypeScript: il comando confronta le dipendenze del lockfile con gli avvisi del registro npm e termina con esito non riuscito se trova un avviso di gravità `high` o `critical` non ignorato. Le opzioni `--ignore`, `--ignore-unfixable`, `--ignore-registry-errors`, `--prod` e `--dev` non si usano.

Un avviso accettato si elenca singolarmente con il suo identificativo GHSA in `auditConfig.ignoreGhsas` di `pnpm-workspace.yaml` del repository e, nella stessa modifica, in questo contratto con il repository e il motivo; non si accettano intervalli di avvisi né eccezioni per un intero pacchetto.

Eccezioni accettate: nessuna, in alcun repository di prodotto.

#### Metadata
  * type: specification

#### Relations
  * define: [Audit delle vulnerabilità delle dipendenze](../Requirements/ModelDrivenDevelopment.md#audit-delle-vulnerabilità-delle-dipendenze)
---

### Checkout affiancato dello spazio di lavoro

`scripts/checkout-workspace WORKSPACE BRANCH` clona da `https://github.com/ambrogio-app` nella cartella `WORKSPACE` ogni repository del modello che vi manca, fra `ambrogio-model`, `ambrogio-backend`, `ambrogio-satellite`, `ambrogio-cli` e `ambrogio-web`, sul branch `BRANCH` se esiste sul remoto e altrimenti su `main`, con la storia completa, e riporta per ciascuno il branch scelto.

La CI di ogni repository esegue il checkout del repository in prova in `workspace/<repository>` con `fetch-depth: 0`; la CI di un repository di prodotto clona poi `ambrogio-model` in `workspace/ambrogio-model` con la stessa regola di scelta del branch, perché `checkout-workspace` vive in quel repository; segue `checkout-workspace` sulla cartella `workspace` con il branch della modifica, cioè `github.head_ref` per una pull request e altrimenti `github.ref_name`, poi `scripts/model-checks --workspace workspace` dal checkout di `ambrogio-model`.

#### Metadata
  * type: specification

#### Relations
  * define: [Controlli CI dei repository di Ambrogio](../Requirements/ModelDrivenDevelopment.md#controlli-ci-dei-repository-di-ambrogio)
---

### Comando di verifica completo con pnpm

Lo script `verify` del `package.json` di ogni repository di prodotto si esegue con `pnpm verify` dalla radice del repository, nella cartella di lavoro con i repository affiancati, ed esegue in sequenza con `&&`, così che il primo comando fallito interrompa la sequenza con esito non riuscito:

1. `../ambrogio-model/scripts/model-checks`;
2. `pnpm install --frozen-lockfile`;
3. `pnpm audit --audit-level high`;
4. nei client, nella cartella `../ambrogio-backend`, `pnpm install --frozen-lockfile` e `pnpm build`;
5. i comandi `pnpm` dei controlli successivi all'installazione nel job dei controlli della CI del repository, nello stesso ordine, comprese le prove di integrazione `pnpm test:backend` dei client.

Il requisito di ogni repository di prodotto che raffina «Comando di verifica completo» elenca i comandi del punto 5. La suite di test fallisce se gitleaks non è nel `PATH`, perché prova l'hook pre-commit.

Le prove che usano PostgreSQL leggono l'URL di un server PostgreSQL di prova dalla variabile `AMBROGIO_TEST_DATABASE_URL`, senza valore predefinito, e falliscono se manca o se il server non risponde. Il ruolo dell'URL ha il permesso di creare e cancellare database: le prove vi creano soltanto database propri e cancellano soltanto quelli. In CI il server è un servizio del job con l'immagine `pgvector/pgvector:pg18`, autenticazione `trust` e la variabile `postgres://postgres@127.0.0.1:5432/postgres`. In locale `ambrogio-model/scripts/test-postgres start` avvia, o riusa se è già attivo, il container `ambrogio-test-postgres` con la stessa immagine e la stessa autenticazione, pubblicato soltanto su `127.0.0.1` alla porta `AMBROGIO_TEST_POSTGRES_PORT`, `55432` se la variabile manca, attende che accetti connessioni e stampa la riga `AMBROGIO_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:<porta>/postgres` da esportare; `scripts/test-postgres stop` rimuove il container. Lo script richiede Docker e non tocca altri container.

#### Metadata
  * type: specification

#### Relations
  * define: [Comando di verifica completo](../Requirements/ModelDrivenDevelopment.md#comando-di-verifica-completo)
---

### Controlli del modello dello spazio di lavoro

`scripts/model-checks [--workspace DIR]` controlla l'intero modello della cartella di lavoro, predefinita quella che contiene `ambrogio-model`, con Reqvire alla versione risolta da «Risoluzione della versione di Reqvire». Reqvire legge una copia temporanea della cartella di lavoro preparata da `workspace_mirror` di `scripts/reqvire-workspace.sh`, con i soli file che Git vede in ciascun repository del modello, tracciati oppure nuovi e non ignorati, e un worktree Git vuoto per repository: sulla cartella reale Reqvire attraversa anche le dipendenze installate e impiega minuti invece di secondi. Esegue in sequenza `validate`; `lint --json`, fallendo se il rapporto contiene elementi in `auto_fixable` o in `needs_manual_review` e stampandolo; `node scripts/check-model.mjs` con la cartella di lavoro per Git e la copia per Reqvire; `scripts/repo-deps --check-acyclic`, che richiede `python3`. Termina con esito non riuscito al primo controllo fallito. Lo eseguono la CI e l'hook pre-commit di ogni repository del modello e il comando di verifica completo dei repository di prodotto.

#### Metadata
  * type: specification

#### Relations
  * define: [Controllo automatico dell'integrità del modello](../Requirements/ModelDrivenDevelopment.md#controllo-automatico-dellintegrità-del-modello)
---

### Controlli del modello nell'hook pre-commit

L'hook versionato `.githooks/pre-commit` di ogni repository del modello esegue prima la scansione dei segreti secondo «Profilo di scansione dei segreti con gitleaks» e, soltanto se la scansione riesce, `scripts/model-checks` di `ambrogio-model` senza argomenti, cioè sulla cartella che contiene `ambrogio-model`; l'hook termina con l'esito di `model-checks`.

- In `ambrogio-model` lo script è `scripts/model-checks` del repository stesso.
- In un repository di prodotto lo script è `../ambrogio-model/scripts/model-checks` rispetto alla radice del repository, ricavata con `git rev-parse --show-toplevel`. Se quel file non esiste o non è eseguibile, l'hook stampa su stderr `pre-commit: ambrogio-model is not next to this repository; clone https://github.com/ambrogio-app/ambrogio-model beside it and retry.` e termina con esito non riuscito, senza creare il commit.

L'hook di un repository di prodotto è uno script POSIX `sh`.

#### Metadata
  * type: specification

#### Relations
  * define: [Controlli del modello prima del commit](../Requirements/ModelDrivenDevelopment.md#controlli-del-modello-prima-del-commit)
---

### Profilo comune dei workflow GitHub Actions

Ogni workflow dichiara a livello di workflow `permissions: contents: read`; soltanto un job che pubblica un pacchetto riceve in più `packages: write`, e nessun altro job riceve permessi di scrittura.

Le action esterne sono indicate con l'impronta SHA completa del commit e con la versione come commento: `actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803` (v6) e `actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38` (v6); un repository che usa altre action le fissa allo stesso modo nel proprio contratto. Un aggiornamento di un'action sostituisce impronta e commento insieme in tutti i repository.

Ogni job usa il runner `ubuntu-24.04` e dichiara `timeout-minutes`. Ogni passo `actions/checkout` imposta `persist-credentials: false`. Il workflow dei controlli e quello della scansione dei segreti dichiarano l'evento `workflow_call`; un workflow di pubblicazione li richiama come job e il job che pubblica dipende da entrambi con `needs`.

In `ambrogio-model` i job sono `Model checks` di `ci.yml`, con `timeout-minutes: 15` e `actions/setup-node` con Node.js 24 e `package-manager-cache: false`, e `Gitleaks` di `secret-scan.yml`, con `timeout-minutes: 10`.

#### Metadata
  * type: specification

#### Relations
  * define: [Workflow GitHub Actions con privilegi e durata limitati](../Requirements/ModelDrivenDevelopment.md#workflow-github-actions-con-privilegi-e-durata-limitati)
---

### Profilo di installazione con pnpm e Corepack

Il `package.json` di ogni repository di prodotto dichiara `"packageManager": "pnpm@<versione esatta>"`. Il job della CI, dopo `actions/setup-node` con Node.js 24, esegue `corepack enable` con la variabile d'ambiente `COREPACK_ENABLE_DOWNLOAD_PROMPT` uguale a `0`; da quel passo ogni comando `pnpm` usa la versione dichiarata dal `package.json` della cartella in cui gira. La fase di build di un Dockerfile parte da un'immagine ufficiale `node` 24, dichiara `ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0` ed esegue `corepack enable` prima di copiare il manifest e installare. Workflow e Dockerfile non installano pnpm con `npm install --global` né lo eseguono con `npx`. Le installazioni in CI e nelle build delle immagini usano `pnpm install --frozen-lockfile`.

Ogni dipendenza diretta di ogni `package.json`, di esecuzione e di sviluppo, è dichiarata con una versione `MAJOR.MINOR.PATCH` uguale a quella risolta in `pnpm-lock.yaml`; fa eccezione soltanto il protocollo `workspace:*` per i package interni dello stesso workspace. `allowBuilds` in `pnpm-workspace.yaml` elenca per nome, con `true`, soltanto i pacchetti il cui script di installazione serve a preparare un binario nativo o a scaricarlo, e dichiara con `false` i pacchetti il cui script è presente ma non deve essere eseguito; un pacchetto non elencato non esegue script. `pnpm-workspace.yaml` non imposta `minimumReleaseAge`, così che resti attiva l'attesa predefinita di pnpm di 24 ore dalla pubblicazione; una versione da adottare prima che l'attesa sia trascorsa è elencata singolarmente in `minimumReleaseAgeExclude` come `<pacchetto>@<versione esatta>`, senza intervalli né eccezioni per l'intero pacchetto, e l'eccezione si rimuove quando quella versione non è più nel lockfile. Ogni repository elenca nel proprio contratto i pacchetti ammessi in `allowBuilds` e le eccezioni all'attesa.

Node.js 24 include Corepack, che scarica la versione di pnpm dichiarata e ne verifica la firma; Node.js 25 e successivi non lo includono più, e il passaggio a una di quelle versioni richiede di installare Corepack separatamente con una modifica di questo contratto.

#### Metadata
  * type: specification

#### Relations
  * define: [Installazione delle dipendenze con pnpm attivato da Corepack](../Requirements/ModelDrivenDevelopment.md#installazione-delle-dipendenze-con-pnpm-attivato-da-corepack)
---

### Profilo di scansione dei segreti con gitleaks

Ogni repository di Ambrogio usa gitleaks 8.30.1 per impedire che segreti, come chiavi API o token, entrino nella storia Git.

- **CI.** Il workflow `.github/workflows/secret-scan.yml` si esegue a ogni push su qualunque branch, a ogni pull request, su richiesta manuale e come workflow richiamabile. Recupera l'intera storia con `fetch-depth: 0`. Scarica dalla release ufficiale l'archivio `gitleaks_8.30.1_linux_x64.tar.gz`, ne verifica con `sha256sum --check --strict` l'impronta SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb` prima di estrarlo, interrompe il job se l'impronta non corrisponde ed esegue `gitleaks git --redact --no-banner --exit-code 1 .`: un rilevamento fa fallire il job e l'output non riporta il valore del segreto.
- **Hook locale.** Lo script di shell versionato `.githooks/pre-commit` esegue `gitleaks git --pre-commit --staged --redact --no-banner .` sulle modifiche in staging. Se `gitleaks` non è nel `PATH`, stampa un messaggio che indica la versione richiesta e dove installarla e termina con esito non riuscito, impedendo il commit. L'hook si attiva in ogni clone con `git config core.hooksPath .githooks`.

Si usa la configurazione predefinita di gitleaks, senza file `.gitleaks.toml`, finché un'eccezione non è registrata secondo «Ritrovamenti di segreti risolti con la rimozione». Un aggiornamento di gitleaks cambia insieme versione e impronta in questo contratto e nei workflow e negli hook di tutti i repository.

#### Metadata
  * type: specification

#### Relations
  * define: [Scansione dei segreti nella CI](../Requirements/ModelDrivenDevelopment.md#scansione-dei-segreti-nella-ci)
---

### Registro della baseline Reqvire

Fonte: baseline Reqvire, repository https://github.com/adrianofoschi/reqvire-baseline, commit adottato `bbc76b2`. Il catalogo delle decisioni è `CATALOG.md` a quel commit; i temi sono in `themes/`. Questo elemento è l'unico del modello che nomina il commit.

#### Temi esaminati e non adottati
- «Business authorization»: Ambrogio non ha operazioni il cui permesso dipende da chi le invoca, perché la famiglia condivide un'unica identità e l'accesso è limitato dalla rete dell'installazione; l'autenticazione, comprese «Authentication delegated to an external identity provider» e «Keycloak as identity provider», non è adottata: il backend non ha account né autenticazione applicativa, secondo «Assenza di account e autenticazione applicativa nell'MVP».
- «Business module autonomy»: il backend ha un solo modulo business.
- «Domain events»: il Domain non registra eventi delle proprie transizioni.
- «Open-core editions»: Ambrogio ha una sola edizione open source con licenza MIT, senza parti proprietarie.
- «SQLite persistence with Kysely»: il backend conserva le conversazioni in PostgreSQL, secondo «PostgreSQL persistence with Kysely».
- «Unit of Work»: nessun caso d'uso richiede l'atomicità di più operazioni di porta; ogni transizione persistente è una sola operazione della porta di scrittura.

#### Decisioni esaminate e non adottate
- «Drain of accepted requests on shutdown»: all'arresto i turni in corso sono interrotti, secondo «Interruption of active operations on shutdown».
- «OpenAPI contract generated from the routes»: non adottata per decisione della persona; l'API HTTP pubblica è descritta dai contratti del modello e dal riferimento delle API HTTP di `ambrogio-docs`, il protocollo dallo schema JSON pubblicato.
- «MCP for model authoring and CLI for repeatable checks»: il modello si legge e si modifica soltanto con la CLI Reqvire.
- «Protected HTTP surface by default»: non adottata, perché il backend non ha autenticazione applicativa; l'accesso al backend è limitato dalla rete dell'installazione e dal reverse proxy.
- «No save after refused creation»: la creazione di un turno non prevede rifiuti; i dati non validi sono rifiutati prima del Domain.
- «References between aggregates by identity»: il Domain ha un solo tipo di aggregato.
- «Independent graph per process»: ogni componente esegue un solo processo.
- «Instance lifetime by need»: dipende da un contesto del chiamante e da una Unit of Work, non adottati.
- «Module views over one shared database resource»: il backend ha un solo modulo business, che possiede tutte le tabelle del database e riceve l'intera risorsa.
- «Canonical value normalized once by its owner»: nessun valore business ha una forma canonica; il testo dei turni è conservato invariato e gli identificativi sono opachi.

#### Metadata
  * type: source

#### Relations
  * define: [Decisioni tratte dalla baseline Reqvire](../Requirements/ModelDrivenDevelopment.md#decisioni-tratte-dalla-baseline-reqvire)
---

### Risoluzione della versione di Reqvire

Il file `.reqvire-version` di `ambrogio-model` contiene la versione esatta di Reqvire, come numero di versione oppure come nome completo del pacchetto `@reqvire-org/reqvire@<versione>`. La funzione `reqvire_cmd` di `scripts/reqvire-workspace.sh` sceglie il comando Reqvire in quest'ordine: il binario locale indicato da `REQVIRE`; il pacchetto indicato da `REQVIRE_NPX_PACKAGE`; il pacchetto della versione scritta in `.reqvire-version`. Il pacchetto si esegue con `npx -y` e `npm_config_loglevel=error`. Se il pacchetto risultante è vuoto o termina con `@latest` o `@next`, la funzione stampa un errore e fallisce senza ripiegare su una versione mobile. `scripts/check-model.mjs` legge la stessa versione da `.reqvire-version`. Gli script, gli hook e i workflow dei repository usano questa risoluzione e non ripetono il numero di versione.

#### Metadata
  * type: specification

#### Relations
  * define: [Versione fissata di Reqvire](../Requirements/ModelDrivenDevelopment.md#versione-fissata-di-reqvire)
---

### Ruleset del branch principale

Ogni repository di Ambrogio ha un ruleset di branch chiamato `main`, con applicazione `active`, che ha come destinazione il branch predefinito, nessun attore escluso e le regole:

- `pull_request`, che ammette l'integrazione solo tramite pull request, con `required_approving_review_count` uguale a 0;
- `required_status_checks`, con il job dei controlli della CI e il job della scansione dei segreti del repository prodotti da GitHub Actions e `strict_required_status_checks_policy` uguale a `false`;
- `non_fast_forward`, che vieta la riscrittura forzata;
- `deletion`, che vieta la cancellazione del branch.

In `ambrogio-model` i controlli richiesti sono `Model checks` e `Gitleaks`. Ogni repository di prodotto nomina i propri controlli richiesti nel contratto del proprio ruleset.

#### Metadata
  * type: specification

#### Relations
  * define: [Controlli obbligatori prima del merge](../Requirements/ModelDrivenDevelopment.md#controlli-obbligatori-prima-del-merge)
---

### Script di integrità del modello

Lo script `scripts/check-model.mjs [workspace]` di `ambrogio-model` legge l'intero modello della cartella di lavoro, predefinita quella che contiene `ambrogio-model`, con Reqvire alla versione di `.reqvire-version` (`search --filter-type <tipo> --json` e `resources`), e legge con `git ls-files` i file tracciati di ogni repository della cartella di lavoro che è la radice di un worktree Git valido e contiene `system-model/`. Segnala:

- ogni requisito, contratto o verifica il cui testo, tolti code span, testi tra virgolette e nomi tra «», contiene una data (ISO `AAAA-MM-GG` oppure giorno, nome del mese e anno, in italiano o in inglese) o le formule `concordato il`, `concordata il`, `deciso il`, `decisa il`, `scelto il`, `scelta il`, anche con `con la persona`, `agreed on` e `decided on`;
- ogni occorrenza, come parola intera e senza distinzione di maiuscole, di `può`, `possono`, `potrebbe`, `potrebbero`, `dovrebbe`, `dovrebbero`, `eventualmente`, `may`, `might`, `could`, `should` e `possibly` nell'enunciato di un requisito (il testo prima della sezione `#### Details`) o nel testo di un contratto `specification`, `constraint`, `behavior`, `input-output` o `state`, tolti code span, testi tra virgolette e nomi tra «»;
- ogni contratto `specification`, `constraint`, `behavior`, `input-output` o `state` con una riga che inizia con `#### Alternative` oppure il cui testo, tolti code span, testi tra virgolette e nomi tra «», contiene, come parole intere e senza distinzione di maiuscole, `Alternative considerate` o `Alternative e conseguenze`;
- ogni verifica di ispezione, analisi o dimostrazione il cui contenuto non contiene `Non automatizzabile:`;
- ogni file tracciato di un repository del modello che corrisponde a `.github/**`, salvo le immagini con estensione `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp` o `.ico`, oppure a `.githooks/**`, `scripts/**`, `Dockerfile*`, `compose*.yaml`, `compose*.yml`, `.dockerignore`, `.gitignore`, `.npmrc`, `package.json`, `tsconfig*.json`, `vitest*.config.*`, a qualunque profondità, oppure a `pnpm-workspace.yaml` nella radice del repository, e che nessun elemento del modello riferisce.

Lo script stampa una riga per violazione e termina con stato 1 se ne trova almeno una, con stato 0 altrimenti.

#### Metadata
  * type: specification

#### Relations
  * define: [Controllo automatico dell'integrità del modello](../Requirements/ModelDrivenDevelopment.md#controllo-automatico-dellintegrità-del-modello)
---

### Strumenti del modello dello spazio di lavoro

La cartella di lavoro contiene `ambrogio-model` e i repository di prodotto affiancati; i repository del modello sono le cartelle figlie che sono la radice di un worktree Git valido e contengono `system-model/`. `scripts/reqvire-workspace.sh` è l'aiuto condiviso degli script: `workspace_root` restituisce la cartella di lavoro, predefinita quella che contiene `ambrogio-model`, e `workspace_worktrees` elenca i repository del modello.

`scripts/repo-deps [--workspace DIR] [--repo NAME] [--check-acyclic]` ricava dai link Markdown dei repository il grafo delle dipendenze fra repository: un link di un repository che si risolve in un altro repository è una dipendenza. Con `--repo` stampa le dipendenze di un repository e i repository che dipendono da esso; con `--check-acyclic` termina con stato 1 se il grafo ha un ciclo, che Reqvire non rifiuta da sé.

`scripts/change-impact-composite [--workspace DIR] [--base-branch main] [--json] [--keep]` calcola l'analisi d'impatto dell'intero modello: costruisce un repository Git temporaneo il cui commit contiene ogni repository alla propria base, cioè il merge-base con `origin/<base-branch>`, altrimenti con il branch locale, altrimenti `HEAD`, e il cui albero di lavoro contiene lo stato corrente di ogni repository; esegue `change-impact --git-commit HEAD` e riscrive i link del rapporto verso i repository reali al commit di base. Una cartella di lavoro formata da un solo repository con remoto è confrontata direttamente.

#### Metadata
  * type: specification

#### Relations
  * define: [Un solo modello attraverso i repository](../Requirements/ModelDrivenDevelopment.md#un-solo-modello-attraverso-i-repository)
---
