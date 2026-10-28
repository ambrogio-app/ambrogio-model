# Coordinamento dei repository Ambrogio

Ambrogio è descritto da un solo modello Reqvire distribuito sui repository del prodotto, affiancati in una cartella di lavoro:

```text
<cartella di lavoro>/
├── ambrogio-model/      capability e lessico di prodotto, decisioni trasversali, script dello spazio di lavoro
├── ambrogio-backend/    backend e package business
├── ambrogio-satellite/  satellite vocale
├── ambrogio-cli/        client terminale
├── ambrogio-web/        chat web facoltativa
├── ambrogio-docs/       documentazione utente (sito Astro Starlight, in inglese, senza modello)
├── ambrogio-homelab-example/  esempio completo d'installazione domestica con Compose e agenti (in inglese, senza modello)
├── ambrogio-app.github.io/    sito del progetto, una pagina Astro alla radice di ambrogio-app.github.io (in inglese, senza modello)
├── ambrogio-brand/            logo, palette, font e forme del marchio, repository privato (in inglese, senza modello)
└── ambrogio-video/            video dimostrativo del prodotto, repository privato (in inglese, senza modello)
```

Le istruzioni di ciascun repository restano autorevoli per il lavoro al suo interno:

- Modello comune: questo file
- Backend: @../ambrogio-backend/AGENTS.md
- Client terminale: @../ambrogio-cli/AGENTS.md
- Satellite vocale: @../ambrogio-satellite/AGENTS.md
- Chat web facoltativa: @../ambrogio-web/AGENTS.md
- Documentazione utente: @../ambrogio-docs/AGENTS.md

## Un solo modello

- I repository di prodotto hanno ciascuno la propria cartella `system-model/`; insieme a quella di `ambrogio-model` formano un solo modello, letto, modificato e validato dalla cartella di lavoro.
- I collegamenti fra repository sono diretti: un requisito di un client si collega al contratto del backend da cui dipende, un requisito locale raffina con `derivedFrom` la decisione trasversale di `ambrogio-model`.
- Le dipendenze fra repository restano senza cicli: `ambrogio-model` non si collega a nessun repository di prodotto, il backend non si collega ai client. `scripts/repo-deps --check-acyclic` lo controlla.
- I client non fissano una revisione del backend: la compatibilità fra release si stabilisce per versione d'interfaccia. Ogni release del backend dichiara le versioni del protocollo conversazionale e dell'API HTTP pubblica che offre, ogni release di un client quelle che usa, e `ambrogio-docs/reference/versions.md` le riporta. Non serve retrocompatibilità: un cambio incompatibile di un'interfaccia pubblica del backend (protocollo conversazionale, API HTTP, ingresso di prova) si fa nella stessa modifica dei client che la usano, sullo stesso branch, e backend e client si rilasciano insieme; il backend non conserva versioni precedenti di un'interfaccia, e la versione maggiore nel nome (`ambrogio.v1`, `/api/v1`) cambia a ogni cambio incompatibile. `versions.md` indica quali release funzionano insieme.
- I contratti esterni al prodotto (servizi, protocolli e API di altri proprietari, modelli scaricati o distribuiti da fonti esterne) si registrano nel repository che li usa come elementi `type: source` con la versione da cui dipende, l'origine dell'informazione e la prova d'integrazione; i requisiti li citano con Contract References senza ripeterne la versione, e aggiornare la versione è una modifica esplicita dell'elemento con la prova ripetuta. I server MCP di terzi degli agenti d'esempio, come Home Assistant, Music Assistant e OpenCloud, non sono contratti esterni del prodotto e non si registrano come `source` con una versione: il contratto del prodotto è il protocollo MCP, e l'interfaccia usata da ciascun esempio è descritta nel contratto dell'esempio. Le librerie npm restano governate da versioni esatte, lockfile congelato e audit.
- Un cambiamento che tocca più repository usa lo stesso nome di branch in ciascuno; le pull request si integrano in ordine di dipendenza, a partire da `ambrogio-model`.
- `ambrogio-docs` non ha un modello: descrive installazione, configurazione, architettura e funzionamento per chi installa Ambrogio in casa, e ogni fatto documentato deriva dal modello e dal codice. Quando cambia un comportamento pubblico, una configurazione, un limite, un messaggio o una versione compatibile, si aggiornano nello stesso lavoro le pagine interessate di `ambrogio-docs` (in particolare `reference/` e `reference/versions.md`) e si esegue `npm run build`.
- `ambrogio-homelab-example` non ha un modello: è un esempio d'installazione completa, con un Compose per servizio e i file degli agenti, derivato dall'installazione di riferimento senza i suoi dati. Non segue ogni release, come dice il suo README; quando lo si aggiorna, `scripts/check` ne valida i Compose e carica gli agenti con la release del backend indicata in `.env.example`.
- `ambrogio-app.github.io` non ha un modello: è il sito del progetto, pubblicato su <https://ambrogio-app.github.io/>, con ciò che Ambrogio fa e i collegamenti alla documentazione e ai repository. Ogni affermazione sul prodotto concorda con `ambrogio-docs` e con il modello, e una capability in stato `draft`, come l'app per Android e iOS, si presenta soltanto come futura; quando cambia una funzionalità descritta nel sito, lo stesso lavoro aggiorna la pagina ed esegue `npm run build`.
- `ambrogio-brand` non ha un modello ed è privato: contiene logo, palette, font (Nunito) e forme del marchio, unica fonte del brand. Gli altri repository ne tengono una copia fatta con `ambrogio-brand/scripts/sync`, che non si modifica sul posto; `scripts/sync --check` controlla che le copie coincidano. Un cambio del brand si fa prima in `ambrogio-brand` e poi, con lo stesso branch, nei repository che ricevono la copia. Il sito e la documentazione hanno soltanto il tema chiaro; la chat web fa eccezione e segue il tema chiaro o scuro del dispositivo, come dice il suo contratto.
- Tutto il progetto è distribuito con licenza MIT: ogni repository, pubblico o privato, ha il testo della licenza nel file `LICENSE`. I contenuti di terzi, come il font Nunito (SIL Open Font License) o i loghi dei servizi di altri proprietari, conservano la propria licenza, e il README del repository ne indica l'origine.
- `ambrogio-video` non ha un modello ed è privato: produce il video dimostrativo di Ambrogio, con schermate simulate di chat web, Home Assistant e Music Assistant generate fotogramma per fotogramma, il satellite e l'audio presi da registrazioni reali. Ciò che il video mostra concorda con `ambrogio-docs`; legge il brand direttamente da `ambrogio-brand` affiancato, senza tenerne una copia. Le registrazioni restano fuori dal repository, e dal video si tagliano le parti con dati dell'installazione.
- La visibilità dei repository su GitHub è una decisione della persona: non renderli pubblici né cambiarne la visibilità.

## Reqvire: solo CLI

- Il modello si legge e si modifica soltanto con la CLI Reqvire, alla versione scritta in `ambrogio-model/.reqvire-version`, eseguita sulla cartella di lavoro; non si usano server MCP Reqvire.

```bash
rv() { npm_config_loglevel=error npx -y "@reqvire-org/reqvire@$(cat ambrogio-model/.reqvire-version)" --workspace "$PWD" "$@"; }   # dalla cartella di lavoro
```

- Scrittura: `rv add`, `rv link`, `rv unlink`, `rv relink`, `rv rename`, `rv rm`, `rv mv`, `rv merge`; leggere `rv <comando> --help` prima dell'uso. La modifica diretta dei file Markdown del modello è ammessa quando la CLI non offre l'operazione; dopo ogni modifica eseguire `rv format`, `rv validate` e `rv lint`.
- Controlli dell'intero modello: `ambrogio-model/scripts/model-checks` (validazione, lint senza rilievi, integrità del modello, grafo fra repository senza cicli). Impatto delle modifiche su tutti i repository: `ambrogio-model/scripts/change-impact-composite`.

## Il modello comanda

- Ogni sviluppo rispetta tutte le decisioni registrate nel modello e segue la scaletta: capability, concetti e ontologie, requisiti, contratti, contratti semantici, verifiche, poi test e implementazione, infine validazione e revisione.
- Il modello applica le proprie regole di integrità: contratti dipendenti dichiarati come Contract References, file di governo collegati al modello, verifiche manuali con «Non automatizzabile:», obblighi con «deve» e senza `può`, `dovrebbe`, `eventualmente`, nessuna data, storia delle decisioni o esito di esecuzioni in requisiti, contratti e verifiche, alternative e motivo di una scelta nei Details del requisito proprietario e non nei contratti, e decisioni sostituite rimosse nella stessa modifica. Il modello descrive ciò che vale oggi: la storia resta in Git, gli esiti dei test nella CI e quelli delle verifiche manuali nel messaggio del commit o nella pull request che le esegue.
- Prima si modifica il modello, poi il codice. Un comportamento o una scelta tecnica non registrati nel modello non si implementano; una decisione che ne sostituisce un'altra va concordata e registrata esplicitamente come sostituzione.

## Baseline Reqvire

- Molte decisioni del modello sono tratte dalla baseline Reqvire, un catalogo di decisioni adottabili. La baseline è la fonte da cui le decisioni sono copiate, non una dipendenza: le decisioni adottate appartengono ad Ambrogio, che le adatta e le cambia indipendentemente.
- `ambrogio-model` registra la baseline come elemento `source` con indirizzo, commit adottato e decisioni esaminate e non adottate con il motivo. Ogni requisito che registra una decisione tratta dalla baseline ne indica l'origine nei `Details`: il nome della decisione come nel catalogo, tra « e », e se è adottata o adattata, con cosa cambia. Nessun collegamento Reqvire punta alla baseline.
- Il passaggio a un commit più recente della baseline è una modifica esplicita, fatta dopo aver rivisto le differenze fra i due commit.

## Dati di installazione

- Il modello registra obblighi e decisioni del prodotto, non dati di una specifica installazione. Non riportare in modelli, codice, test, commit o documentazione indirizzi IP, nomi host, domini, percorsi personali, credenziali, identificativi di dispositivi o entità, nomi di stanze, né la configurazione effettiva di chi usa il prodotto. Le evidenze di prove su installazioni reali descrivono l'ambiente in termini generici: per esempio «l'installazione di riferimento», l'architettura, l'hardware o la versione usata. Gli esempi usano valori segnaposto o indirizzi di esempio.
- I file d'esempio distribuiti dai repository e gli esempi della documentazione sono in inglese, descrizioni e istruzioni degli agenti comprese. Restano in italiano soltanto i valori che il prodotto richiede in italiano, come l'indicazione di rispondere in italiano o un codice di lingua. Le modifiche provate su un'installazione reale, come un prompt, non passano agli esempi senza una decisione esplicita della persona.

## CI

- Ogni repository pubblico ha `.github/workflows/ci.yml`, eseguito a ogni push su `main` e a ogni pull request. Nei repository del modello la CI scarica gli altri repository affiancati, ciascuno sul branch con lo stesso nome se esiste, altrimenti su `main` (`ambrogio-model/scripts/checkout-workspace`), ed esegue i controlli dell'intero modello; nei repository di prodotto seguono l'installazione con pnpm attivato da Corepack alla versione di `packageManager` e con lockfile congelato, l'audit delle dipendenze (`pnpm audit --audit-level high`, eccezioni soltanto per singolo avviso GHSA registrato nel modello), typecheck, test e build, e nei client le prove di integrazione contro il backend affiancato; in `ambrogio-docs` `astro check`, build del sito e controllo dei link interni; a ogni push su `main`, superati CI e scansione dei segreti, `pages.yml` pubblica il sito su <https://ambrogio-app.github.io/ambrogio-docs/>; in `ambrogio-app.github.io` typecheck e build, e `pages.yml` pubblica allo stesso modo il sito del progetto su <https://ambrogio-app.github.io/>. La pubblicazione delle immagini di backend, satellite e chat web richiede CI e scansione dei segreti superate.
- Il branch `main` di ogni repository pubblico accetta modifiche soltanto tramite pull request con CI e scansione dei segreti superate: un ruleset GitHub rifiuta push diretti, riscrittura forzata e cancellazione, per chiunque. Nei repository privati il piano GitHub non offre i ruleset, ma ogni modifica passa comunque da una pull request con la scansione dei segreti superata. Ogni lavoro si fa su un branch e si integra con una pull request.
- Prima di un push eseguire in locale gli stessi controlli: in ogni repository di prodotto `pnpm verify` li esegue tutti, nell'ordine della CI; il lint Reqvire pulito è bloccante.
- Le pubblicazioni delle immagini scrivono nel riepilogo del job il riferimento dell'immagine pubblicata.

## Scansione dei segreti

- Tutti i repository usano gitleaks 8.30.1: in CI il workflow `.github/workflows/secret-scan.yml` scansiona l'intera storia a ogni push e pull request (e blocca la pubblicazione delle immagini); in locale l'hook versionato `.githooks/pre-commit` blocca i commit che aggiungono segreti e, dopo la scansione, esegue i controlli dell'intero modello con `ambrogio-model/scripts/model-checks`: nei repository di prodotto richiede `ambrogio-model` affiancato e blocca il commit se manca.
- In ogni nuovo clone attivare l'hook con `git config core.hooksPath .githooks`; `gitleaks` deve essere nel `PATH` di chi committa.
- Non aggirare l'hook con `--no-verify` e non disattivarlo: un ritrovamento si risolve rimuovendo il segreto (e ruotandolo se è già stato committato), oppure, se è un falso positivo, concordando con la persona un'eccezione registrata nel modello.
- Esempi e documentazione usano solo valori segnaposto per chiavi, token e password.
