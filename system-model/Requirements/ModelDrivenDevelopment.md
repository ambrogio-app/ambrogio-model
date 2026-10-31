# Elements

### Audit delle vulnerabilità delle dipendenze

Quando viene eseguito un push sul branch principale o viene proposta o aggiornata una pull request, la CI di ogni repository di prodotto deve controllare le dipendenze del lockfile rispetto alle vulnerabilità note e deve fallire se trova una vulnerabilità di gravità alta o critica che non è elencata individualmente, con il proprio identificativo e il motivo, fra le eccezioni accettate del modello.

#### Details
Prima di accettare un'eccezione si aggiorna la dipendenza vulnerabile, anche transitiva, a una versione corretta compatibile con gli intervalli dichiarati. Ogni repository di prodotto raffina questo requisito con il proprio job e la relativa prova; il comando di verifica completo ripete l'audit in locale.

Origine: baseline Reqvire «Dependency vulnerability audit», adattata: senza l'esecuzione notturna programmata, per decisione della persona; un nuovo avviso emerge al primo push o alla prima pull request successivi; le prove dei repository controllano il comando e la configurazione dell'audit senza interrogare il registro, che soltanto la CI e il comando di verifica completo consultano.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Comando di verifica completo

Ogni repository di prodotto deve offrire un unico comando che esegue in locale, nell'ordine della CI del repository, i controlli dell'intero modello, l'installazione congelata delle dipendenze, l'audit delle dipendenze, il controllo TypeScript, la suite di test, la build e, nei client, la preparazione del backend affiancato e le prove di integrazione contro di esso; il comando deve terminare con esito non riuscito al primo controllo fallito o quando manca una risorsa richiesta, come `ambrogio-model`, il backend affiancato, gitleaks o il database PostgreSQL di prova, senza saltare in silenzio un controllo.

#### Details
Il comando permette di eseguire prima di un push gli stessi controlli della CI secondo «Controlli prima dell'integrazione». Le regole di architettura con le loro fixture negative fanno parte della suite di test.

Le prove che usano PostgreSQL, nel backend e nelle prove di integrazione dei client contro il backend affiancato, richiedono un server PostgreSQL di prova; `scripts/test-postgres` lo avvia in locale come in CI, così che il comando non dipenda da un database installato a mano.

Origine: baseline Reqvire «Complete verification command», adattata: i passi sono quelli della CI di ciascun repository; Ambrogio non ha un linter del codice, e le regole di architettura girano nella suite di test.

#### Metadata
  * type: requirement

#### Contract References
  * [Audit delle dipendenze con pnpm](../Contracts/ModelDrivenDevelopment.md#audit-delle-dipendenze-con-pnpm)
  * [Controlli del modello dello spazio di lavoro](../Contracts/ModelDrivenDevelopment.md#controlli-del-modello-dello-spazio-di-lavoro)
  * [Profilo di installazione con pnpm e Corepack](../Contracts/ModelDrivenDevelopment.md#profilo-di-installazione-con-pnpm-e-corepack)

#### Relations
  * satisfiedBy: [test-postgres](../../scripts/test-postgres)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Compatibilità fra release per versione d'interfaccia

Ogni release del backend deve dichiarare le versioni del protocollo conversazionale e dell'API HTTP pubblica che offre, e ogni release di un client quelle che usa; un cambio incompatibile di un'interfaccia pubblica del backend, cioè del protocollo conversazionale, dell'API HTTP pubblica o dell'ingresso di prova del server conversazionale, deve essere fatto nella stessa modifica dei client che usano quell'interfaccia, sullo stesso branch in ciascun repository, deve cambiare la versione maggiore nel nome dell'interfaccia quando il nome la porta, e backend e client devono essere rilasciati insieme; il backend non deve conservare versioni precedenti di un'interfaccia.

#### Details
Nessun client fissa una revisione del backend e nessuna interfaccia pubblica del backend ha versioni coesistenti: quando il backend cambia un'interfaccia in modo incompatibile, i client che la usano si aggiornano nella stessa modifica. Il protocollo conversazionale porta la versione maggiore nel sottoprotocollo, `ambrogio.v1`, e l'API HTTP pubblica nel percorso, `/api/v1`; la versione nel nome cambia a ogni cambio incompatibile. `ambrogio-docs/reference/versions.md` riporta, per le release correnti e per quelle che seguono, le versioni d'interfaccia offerte o usate e indica quali release funzionano insieme; le release precedenti a quelle correnti non sono coperte dalla documentazione; una release di un client che usa una versione non più offerta non funziona con le release successive del backend.

Origine: baseline Reqvire «Compatibility between releases by interface version», adattata: un cambio incompatibile si fa nella stessa modifica del backend e dei client che usano l'interfaccia, rilasciati insieme, e la versione precedente non resta disponibile come elemento distinto del modello del backend.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Contratti esterni registrati con la loro versione

Quando un repository del modello dipende da un contratto esterno al prodotto, cioè da un servizio, un protocollo o un'API di un altro proprietario o da un modello scaricato o distribuito che proviene da una fonte esterna, il repository che lo usa deve registrarlo nella propria cartella `system-model/` come elemento `type: source`, posseduto con `define` da un proprio requisito, che dichiara la versione da cui dipende, l'origine dell'informazione e la prova d'integrazione; ogni requisito che possiede un contratto dipendente da quella versione deve citare l'elemento con una Contract Reference, e i testi di requisiti e contratti non devono ripeterne la versione; l'aggiornamento della versione deve essere una modifica esplicita dell'elemento `source`, fatta nella stessa modifica che ripete la prova d'integrazione.

#### Details
Un contratto esterno resta fuori dalla cartella di lavoro: nessun collegamento Reqvire punta a un repository o a un documento esterni, e l'elemento `source` ne riporta l'indirizzo come testo. La versione dichiarata è quella da cui il prodotto dipende, per esempio la release minima di un servizio che offre l'interfaccia usata o il file fissato con la sua impronta; quando la prova d'integrazione non registra la versione con cui è stata eseguita, l'elemento lo dichiara invece di attribuirle una versione. Un contratto che descrive un valore di configurazione d'esempio, come l'identificativo di un modello in un file d'esempio, lo riporta come esempio. Le interfacce del backend usate dai client appartengono al modello e non sono contratti esterni.

Le librerie npm non sono registrate come elementi `source`: le governano le versioni esatte e il lockfile congelato di «Installazione delle dipendenze con pnpm attivato da Corepack» e l'audit di «Audit delle vulnerabilità delle dipendenze», e un modello distribuito dentro un pacchetto npm segue la versione del pacchetto.

Origine: baseline Reqvire «External contracts recorded with their version», adattata: la registrazione copre servizi, protocolli, API esterne e modelli scaricati o distribuiti, non le librerie npm, governate da versioni esatte, lockfile congelato e audit; la parte sulle versioni coesistenti di un contratto interno come elementi distinti è esclusa da «Compatibilità fra release per versione d'interfaccia», perché backend e client cambiano e si rilasciano insieme.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Controlli CI dei repository di Ambrogio

Quando viene eseguito un push sul branch principale, viene proposta o aggiornata una pull request, viene richiesta un'esecuzione manuale o un altro workflow la richiama, la CI di ogni repository del modello deve scaricare affiancati gli altri repository del modello, ciascuno sul branch con lo stesso nome della modifica se esiste e altrimenti su `main`, ed eseguire i controlli dell'intero modello e, nei repository di prodotto, il controllo TypeScript, la suite di test, comprese le prove di integrazione contro i repository affiancati, e la build, e deve fallire se uno di questi controlli fallisce.

#### Details
Ogni repository di prodotto raffina questo requisito con i nomi dei propri job e i passi propri, e ne ripete i controlli in locale con il comando di verifica completo. In `ambrogio-model` la CI esegue i controlli del modello e, per una pull request, riporta l'analisi d'impatto composita nel riepilogo del job. I repository senza modello, come la documentazione, il sito e l'esempio d'installazione, eseguono nella propria CI i controlli indicati nelle loro istruzioni.

Origine: baseline Reqvire «Blocking CI checks on proposed changes», adattata: la CI lavora sul checkout affiancato dei repository del modello e comprende le prove di integrazione fra repository.

Origine: baseline Reqvire «Side-by-side workspace checkout in CI», adattata: l'indirizzo del proprietario e l'elenco dei repository sono scritti in `scripts/checkout-workspace` invece che passati come parametri.

#### Metadata
  * type: requirement

#### Contract References
  * [Controlli del modello dello spazio di lavoro](../Contracts/ModelDrivenDevelopment.md#controlli-del-modello-dello-spazio-di-lavoro)
  * [Strumenti del modello dello spazio di lavoro](../Contracts/ModelDrivenDevelopment.md#strumenti-del-modello-dello-spazio-di-lavoro)

#### Relations
  * satisfiedBy: [ci.yml](../../.github/workflows/ci.yml)
  * satisfiedBy: [checkout-workspace](../../scripts/checkout-workspace)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Controlli del modello prima del commit

Quando si crea un commit in un clone di un repository del modello con gli hook versionati attivi, l'hook pre-commit deve eseguire, dopo la scansione dei segreti, i controlli dell'intero modello della cartella di lavoro con `scripts/model-checks` di `ambrogio-model` sul contenuto in staging del repository del commit, e deve impedire il commit se uno di questi controlli fallisce oppure se, in un repository di prodotto, `ambrogio-model` non è affiancato al repository.

#### Details
I controlli comprendono la validazione e il lint di Reqvire, lo script di integrità del modello e il controllo del grafo fra repository: le regole di integrità si riapplicano a ogni commit, e la CI ripete gli stessi controlli. Ogni repository di prodotto raffina questo requisito con il proprio hook e la relativa prova.

Leggere il contenuto in staging impedisce che un commit parziale porti nella storia una violazione che la cartella di lavoro non mostra più.

Origine: baseline Reqvire «Model checks before commit», adattata: l'hook di un repository di prodotto controlla l'intero modello dal checkout affiancato di `ambrogio-model` e impedisce il commit quando `ambrogio-model` non è affiancato.

#### Metadata
  * type: requirement

#### Contract References
  * [Controlli del modello dello spazio di lavoro](../Contracts/ModelDrivenDevelopment.md#controlli-del-modello-dello-spazio-di-lavoro)
  * [Profilo di scansione dei segreti con gitleaks](../Contracts/ModelDrivenDevelopment.md#profilo-di-scansione-dei-segreti-con-gitleaks)

#### Relations
  * satisfiedBy: [pre-commit](../../.githooks/pre-commit)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Controlli obbligatori prima del merge

Quando una modifica viene integrata nel branch principale di un repository pubblico di Ambrogio, il repository GitHub deve accettarla soltanto tramite una pull request i cui controlli della CI e scansione dei segreti sono superati, e deve rifiutare il push diretto, la riscrittura forzata e la cancellazione del branch principale; in un repository privato ogni modifica deve comunque essere integrata tramite una pull request con la scansione dei segreti superata.

#### Details
La regola vale per chiunque, amministratori compresi: ogni modifica passa da un branch e da una pull request, così che CI e scansione dei segreti precedano sempre l'integrazione. Ogni repository di prodotto registra i nomi dei propri controlli richiesti. Il piano GitHub dell'organizzazione non offre i ruleset sui repository privati, come `ambrogio-brand` e `ambrogio-video`: lì l'integrazione tramite pull request è una regola di lavoro e non un vincolo del repository.

Origine: baseline Reqvire «Blocking CI checks on proposed changes», adattata: l'impedimento dell'integrazione è realizzato da un ruleset GitHub che richiede anche la scansione dei segreti.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Controlli prima dell'integrazione

Prima di proporre una modifica per l'integrazione, chi la propone deve eseguire in locale i controlli della CI dei repository interessati, compresi i controlli dell'intero modello, e deve eseguire la copertura, la tracciabilità e l'analisi d'impatto dell'intero modello, rivedendo gli elementi segnalati; un lint del modello con correzioni automatiche o elementi da rivedere deve bloccare la proposta.

#### Details
Nei repository di prodotto i controlli della CI si eseguono con `pnpm verify`. Il modello si valida anche durante la costruzione, dopo modifiche significative. Il rapporto di copertura non certifica che i test siano passati e le verifiche segnalate dall'analisi d'impatto richiedono revisione, non sono automaticamente fallite. Al termine si riportano le modifiche, i controlli eseguiti e le lacune o attività esterne ancora aperte.

Origine: baseline Reqvire «Local checks before push», adattata: senza l'hook `pre-push` della baseline, per decisione della persona, il comando di verifica si esegue a mano prima del push; «Model validation and review before completion», adattata: l'analisi d'impatto copre tutti i repository con `scripts/change-impact-composite`.

#### Metadata
  * type: requirement

#### Contract References
  * [Controlli del modello dello spazio di lavoro](../Contracts/ModelDrivenDevelopment.md#controlli-del-modello-dello-spazio-di-lavoro)
  * [Strumenti del modello dello spazio di lavoro](../Contracts/ModelDrivenDevelopment.md#strumenti-del-modello-dello-spazio-di-lavoro)

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * satisfiedBy: [change-impact-composite](../../scripts/change-impact-composite)
  * satisfiedBy: [model-checks](../../scripts/model-checks)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Controllo automatico dell'integrità del modello

Quando la CI di un repository di Ambrogio controlla il modello, deve eseguire `scripts/model-checks` di `ambrogio-model` sulla cartella di lavoro, che esegue la validazione e il lint di Reqvire, lo script di integrità del modello e il controllo delle dipendenze fra repository, e deve fallire se uno di questi controlli segnala una violazione o non riesce a eseguire.

#### Details
Lo script di integrità copre le regole verificabili sul testo e sui file che `validate` e `lint` di Reqvire non controllano. Gli script dei controlli esistono soltanto in `ambrogio-model`; ogni repository di prodotto li esegue dal checkout affiancato nella propria CI.

Origine: baseline Reqvire «Blocking engineering model checks in CI», adattata: i controlli girano sull'intero modello della cartella di lavoro e comprendono lo script di integrità e il controllo del grafo fra repository.

#### Metadata
  * type: requirement

#### Contract References
  * [Risoluzione della versione di Reqvire](../Contracts/ModelDrivenDevelopment.md#risoluzione-della-versione-di-reqvire)

#### Relations
  * satisfiedBy: [ci.yml](../../.github/workflows/ci.yml)
  * satisfiedBy: [check-model.mjs](../../scripts/check-model.mjs)
  * satisfiedBy: [model-checks](../../scripts/model-checks)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Controllo dei segreti prima del commit

Quando si crea un commit in un clone di un repository di Ambrogio con gli hook versionati attivi, il controllo pre-commit deve scansionare con gitleaks le modifiche in staging, senza che un commento nel codice nasconda un rilevamento, e deve impedire il commit se rileva un segreto oppure se gitleaks non è disponibile alla versione richiesta.

#### Details
Ogni repository di prodotto raffina questo requisito con il proprio hook e la relativa prova.

Origine: baseline Reqvire «Local blocking of commits with secrets», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Profilo di scansione dei segreti con gitleaks](../Contracts/ModelDrivenDevelopment.md#profilo-di-scansione-dei-segreti-con-gitleaks)

#### Relations
  * satisfiedBy: [pre-commit](../../.githooks/pre-commit)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Dati di installazione esclusi dagli artefatti del progetto

Il modello, il codice, i test, i messaggi di commit e la documentazione dei repository di Ambrogio non devono riportare dati di una specifica installazione, come indirizzi IP, nomi host, domini, percorsi personali, credenziali, identificativi di dispositivi o entità, nomi di stanze o la configurazione effettiva di chi usa il prodotto; esempi ed evidenze devono usare valori segnaposto, indirizzi di esempio o una descrizione generica dell'ambiente, e una modifica provata su un'installazione reale non deve passare agli esempi distribuiti senza una decisione esplicita della persona.

#### Details
Il modello registra obblighi e decisioni del prodotto, non dati di un'installazione. Le evidenze di prove su installazioni reali descrivono l'ambiente in termini generici, per esempio «l'installazione di riferimento», l'architettura, l'hardware o la versione usata. Gli indirizzi GitHub dei repository del prodotto e della baseline sono fatti del prodotto, non dati di un'installazione.

Origine: baseline Reqvire «No installation data in project artifacts», adottata; «Placeholder values in examples», adottata; «Real installation changes not promoted to examples», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Decisioni sostituite rimosse nella stessa modifica

Quando una decisione ne sostituisce un'altra, la modifica che registra la nuova decisione deve aggiornare o rimuovere ogni requisito, contratto e verifica che afferma la decisione sostituita, in qualunque repository del modello, e i testi di requisiti, contratti e verifiche non devono riportare date, storia delle decisioni o esiti di esecuzioni.

#### Details
Il modello descrive gli obblighi validi oggi e come verificarli; la storia è conservata da Git. Decisioni datate accumulate nei contratti convivono con elementi che affermano ancora le decisioni sostituite. Gli esiti dei test sono dati dalla CI; l'esito di una verifica manuale si registra nel messaggio del commit o nella pull request che la esegue, non nel modello.

Origine: baseline Reqvire «Superseded decisions removed in the same change», adattata: il divieto copre anche le verifiche e gli esiti di esecuzioni.

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Decisioni tratte dalla baseline Reqvire

Quando il modello registra una decisione tratta dalla baseline Reqvire, il requisito che la registra deve indicarne l'origine nei propri Details con il nome della decisione come nel catalogo della baseline, tra « e », e con lo stato adottata, oppure adattata con ciò che cambia; il registro della baseline deve indicare l'indirizzo, il commit adottato e i temi e le decisioni esaminati e non adottati con il motivo, e nessun collegamento Reqvire deve puntare alla baseline.

#### Details
La baseline è la fonte da cui le decisioni sono copiate, non una dipendenza: le decisioni adottate appartengono ad Ambrogio, che le adatta e le cambia indipendentemente. La riga d'origine ha la forma «Origine: baseline Reqvire «<nome della decisione>», adottata.» oppure «…, adattata: <cosa cambia>.»; un requisito ne cita anche più d'una. Il passaggio a un commit più recente della baseline è una modifica esplicita, fatta dopo aver rivisto le differenze del catalogo e dei temi fra i due commit, che aggiorna nella stessa modifica i requisiti la cui decisione d'origine è cambiata o scomparsa e il commit del registro. I nomi citati non sono controllati automaticamente.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Dipendenze fra contratti dichiarate come riferimenti

Quando il contenuto di un contratto dipende da un contratto posseduto da un altro requisito, anche in un altro repository del modello, il requisito proprietario del contratto dipendente deve dichiarare una Contract Reference al contratto da cui dipende, e il contratto dipendente non deve ripetere il contenuto di quel contratto.

#### Details
Le Contract References propagano l'analisi di impatto: una modifica del contratto riferito segnala il contratto dipendente per la revisione. Un contratto che ripete un fatto posseduto da un altro requisito resta invariato quando quel fatto cambia, e il modello finisce per contraddirsi senza che l'analisi di impatto lo segnali. Fra repository le Contract References seguono la direzione delle dipendenze: un client verso il backend, un repository di prodotto verso `ambrogio-model`.

Origine: baseline Reqvire «Contract dependencies declared as references», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Documentazione utente aggiornata con i cambiamenti pubblici

Quando una modifica di un repository di prodotto cambia un comportamento pubblico, una configurazione, un limite, un messaggio o una versione compatibile, lo stesso lavoro deve aggiornare le pagine interessate di `ambrogio-docs`, in particolare `reference/` e `reference/versions.md`, ed eseguirne la build.

#### Details
`ambrogio-docs` non ha un modello: ogni fatto documentato deriva dal modello e dal codice dei repository di prodotto. La validazione del modello non dimostra la coerenza della documentazione.

Origine: baseline Reqvire «User documentation updated with public changes», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Esempi distribuiti in inglese

Quando un repository di Ambrogio distribuisce file d'esempio, o la documentazione utente riporta esempi, testi, descrizioni e istruzioni degli agenti di quegli esempi devono essere in inglese, salvo i valori che il prodotto richiede in italiano, come l'indicazione di rispondere in italiano o un codice di lingua.

#### Details
I repository che distribuiscono esempi con obblighi propri, come le configurazioni d'esempio degli agenti del backend, raffinano questo requisito.

Origine: baseline Reqvire «Examples in English», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### File di governo collegati al modello

Ogni file di configurazione di GitHub, compresi i workflow di CI, ogni hook Git, file di build del container, esempio Compose, file di esclusione, configurazione del gestore di pacchetti, del compilatore o del runner di test, script, file di eccezioni della scansione dei segreti `.gitleaksignore` e file di istruzioni per gli agenti `AGENTS.md` di ciascun repository del modello deve essere riferito da almeno un requisito o una verifica del modello.

#### Details
Un file che codifica decisioni ingegneristiche senza un collegamento al modello cambia senza che alcun obbligo lo segnali, e le decisioni presenti solo nei file divergono fra file simili, per esempio fra i workflow di controllo e quello di pubblicazione. Lo script di integrità controlla i file per percorso; gli `AGENTS.md` sono controllati nella revisione.

Le immagini in `.github/`, come i loghi mostrati dai README, sono escluse: sono asset grafici e non codificano decisioni ingegneristiche.

Origine: baseline Reqvire «Governed files linked to the model», adattata: l'insieme esclude le immagini di `.github/**` e comprende gli esempi Compose, `.npmrc`, le configurazioni del runner dei test e gli `AGENTS.md`.

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Formulazione normativa degli obblighi

Gli enunciati dei requisiti devono esprimere gli obblighi con «deve» o «devono», i testi dei contratti devono esprimere ciò che fissano all'indicativo presente, e né gli uni né gli altri devono usare `può`, `possono`, `potrebbe`, `potrebbero`, `dovrebbe`, `dovrebbero` o `eventualmente`; un'opzione lasciata a una parte deve essere espressa nominando la parte che sceglie.

#### Details
Il testo in code span, i messaggi citati e i nomi di elementi tra «» non sono formulazione dell'obbligo. Le sezioni Details dei requisiti sono indicazioni e non vengono controllate. Una formula permissiva rende ambiguo se il comportamento è obbligatorio, facoltativo o scelto da qualcuno, e il codice e il modello finiscono per darne letture diverse. Un contratto obbliga attraverso il requisito che lo possiede, quindi il suo indicativo presente esprime già un obbligo.

Origine: baseline Reqvire «Normative wording of obligations», adattata: le formule vietate sono quelle italiane e inglesi elencate dallo script di integrità.

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Installazione delle dipendenze con pnpm attivato da Corepack

Ogni repository di prodotto deve installare le proprie dipendenze con pnpm alla versione esatta dichiarata nel campo `packageManager` del proprio `package.json`, dal lockfile versionato e senza modificarlo; la CI e la build delle immagini container devono attivare quella versione di pnpm con Corepack, senza installarne un'altra. I manifest devono dichiarare ogni dipendenza diretta, di esecuzione e di sviluppo, con una versione esatta senza intervalli; l'installazione deve eseguire gli script di build soltanto per i pacchetti elencati per nome nella configurazione del repository e deve rifiutare le versioni pubblicate da meno dell'attesa minima configurata, salvo le versioni elencate singolarmente come eccezioni.

#### Details
Ogni repository di prodotto raffina questo requisito con la propria versione di pnpm e le proprie regole di installazione. In sviluppo si usa la stessa versione esatta di pnpm, attivata con Corepack o installata separatamente. Un repository che prepara un altro repository affiancato, come il backend nella CI dei client, esegue pnpm nella cartella di quel repository, così che Corepack usi la versione dichiarata da quel repository.

Origine: baseline Reqvire «pnpm as package manager», adottata; «Exact dependency versions», adattata: i package interni del workspace del backend si dichiarano con il protocollo `workspace:*` invece che con una versione; «Allowlisted dependency build scripts», adottata; «Controlled installation of new releases», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Profilo comune dei workflow GitHub Actions](../Contracts/ModelDrivenDevelopment.md#profilo-comune-dei-workflow-github-actions)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Licenza MIT del progetto

Ogni repository di Ambrogio deve essere distribuito con la licenza MIT, con il testo della licenza nel file `LICENSE` alla radice del repository; i contenuti di terzi inclusi in un repository, come font e loghi di altri proprietari, devono conservare la propria licenza ed essere indicati con la loro origine nel README del repository.

#### Details
La licenza vale per l'intero progetto, compresi i repository senza modello, pubblici o privati, come la documentazione, il sito, il marchio e il video dimostrativo. Un font distribuito con la SIL Open Font License o il logo di un servizio di terzi restano dei loro proprietari e non diventano MIT.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * satisfiedBy: [LICENSE](../../LICENSE)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Marchio da un'unica fonte

Logo, scritta, palette, font e forme di Ambrogio devono avere come unica fonte il repository privato `ambrogio-brand`: gli altri repository devono tenerne copie fatte con lo script `scripts/sync` di `ambrogio-brand` e non devono modificarle sul posto, una modifica del marchio deve essere fatta prima in `ambrogio-brand` e poi copiata, sullo stesso branch, nei repository che ricevono la copia, con `scripts/sync --check` superato, e il sito e la documentazione devono avere soltanto il tema chiaro.

#### Details
`ambrogio-brand` non ha un modello. Le copie servono perché la CI dei repository pubblici non legge un repository privato. La chat web fa eccezione alla regola del tema: segue il tema chiaro o scuro del dispositivo secondo il contratto della propria schermata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Modello modificato soltanto con la CLI Reqvire

Ogni lettura, modifica e controllo del modello di Ambrogio, in locale e in CI, deve avvenire con la CLI Reqvire eseguita sulla cartella di lavoro, senza server MCP Reqvire; quando la CLI non offre l'operazione richiesta, la modifica diretta dei file Markdown del modello deve essere seguita da `format`, `validate` e `lint`.

#### Details
I comandi si verificano con `<comando> --help` alla versione in uso; esempi della documentazione, delle skill o del branch principale di Reqvire possono non corrispondere. Le modifiche del modello passano per Git con gli hook attivi, come ogni altro commit.

Origine: baseline Reqvire «Command-line model authoring», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Motivazioni nei dettagli del requisito

I testi dei contratti non devono contenere alternative valutate, motivazioni della scelta o storia delle decisioni; quando il modello registra le alternative di una scelta e il motivo della scelta attuale, deve registrarli nei Details del requisito proprietario del contratto, con una riga «Alternative: <alternativa> (<conseguenza che la esclude>); …» e una riga «Motivo: <perché vale la scelta attuale>.», al presente e senza racconto della valutazione.

#### Details
Il contratto è la specifica da realizzare e verificare; le ragioni di una scelta servono a chi la rivede e appartengono al requisito che il contratto precisa, nella sezione Details che non esprime obblighi. Una scelta con più aspetti, come lo stato e gli stili di un client, usa righe qualificate, per esempio «Alternative per lo stato: …». Un'alternativa resta nei Details finché spiega la scelta attuale: un'alternativa esclusa da un'altra decisione del modello si descrive con quella decisione oppure si toglie. Formule come «sono state considerate» o «si è scelto» raccontano la valutazione invece di descrivere il modello di oggi. Lo script di integrità segnala i contratti con un'intestazione `#### Alternative` o con le formule «Alternative considerate» o «Alternative e conseguenze»; forma e contenuto delle righe nei Details sono controllati nella revisione.

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * satisfiedBy: [check-model.mjs](../../scripts/check-model.mjs)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Ordine di lavoro guidato dal modello

Quando una modifica introduce o cambia una capacità o un comportamento di Ambrogio, la modifica deve seguire l'ordine capability, concetti e ontologie, requisiti, contratti, contratti semantici, verifiche, test e implementazione, validazione e revisione, e deve registrare nel modello gli elementi interessati prima dei test e dell'implementazione; un comportamento o una scelta tecnica non registrati nel modello non devono essere implementati.

#### Details
Concetti, ontologie e contratti semantici si introducono quando servono al dominio. Si procede per capability, senza completare prima l'intero modello. Prima di cambiare codice funzionale si leggono i requisiti, i contratti e le verifiche pertinenti e si aggiornano se cambia l'obbligo; il modello esistente si riusa quando descrive già il comportamento. Le modifiche cosmetiche o amministrative non richiedono nuovi requisiti o test. La documentazione ufficiale di Reqvire (https://reqvire.org/) è il riferimento per il metodo e per l'uso dello strumento.

Origine: baseline Reqvire «Eight-step engineering work order», adottata; «Model updated before code», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Ritrovamenti di segreti risolti con la rimozione

Quando la scansione dei segreti segnala un segreto, il ritrovamento deve essere risolto rimuovendo il segreto, e ruotandolo se è già stato committato, senza aggirare l'hook con `--no-verify` né disattivarlo; un falso positivo deve essere risolto soltanto con un'eccezione concordata con la persona e registrata nel modello.

#### Details
Fino a un'eccezione registrata, lo scanner usa le proprie regole predefinite senza eccezioni. Un'eccezione vive soltanto nel file `.gitleaksignore` del repository, riferito dal modello: un commento `gitleaks:allow` nel codice non vale come eccezione, perché la scansione lo ignora.

Origine: baseline Reqvire «Secret findings resolved by removal», adottata; «Recorded exceptions for scanner false positives», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Scansione dei segreti nella CI

Quando viene eseguito un push su qualunque branch o viene proposta una pull request, la CI di ogni repository di Ambrogio deve scansionare con gitleaks l'intera storia Git del repository e deve fallire se rileva un segreto o se la scansione non si completa, senza riportare il valore del segreto nell'output.

#### Details
Ogni repository di prodotto raffina questo requisito con il proprio workflow e il nome del proprio job; un repository che pubblica immagini richiede la scansione prima della pubblicazione.

Alternative considerate: l'azione `gitleaks/gitleaks-action`, che richiede una chiave di licenza per le organizzazioni e aggiunge una dipendenza da un'azione di terzi; la sola scansione in CI, che lascia entrare il segreto nella storia locale; il solo hook locale, che dipende dalla configurazione di ogni clone e non protegge integrazione e pubblicazione. Motivo: il binario fissato e verificato con l'impronta non dipende da licenze né da azioni di terzi, e hook locale e scansione in CI insieme bloccano il segreto prima del commit e prima di integrazione e pubblicazione.

Origine: baseline Reqvire «Full-history secret scan in CI», adottata; «gitleaks as secret scanner», adottata; «Checksum-verified scanner in CI», adottata; «Redacted secret findings», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [secret-scan.yml](../../.github/workflows/secret-scan.yml)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Scelte tecniche concordate con la persona

Quando una modifica introduce una scelta tecnica o architetturale che il modello non registra, chi la propone deve presentare alternative e conseguenze, ottenere la decisione della persona responsabile e registrarla nel modello prima di implementarla; una decisione che ne sostituisce un'altra deve essere registrata come sostituzione esplicita della decisione precedente.

#### Details
Un incarico generale di implementazione non autorizza scelte tecniche nuove; codice, test e commit non sostituiscono la registrazione nel modello. Le decisioni già prese e registrate non si sottopongono di nuovo a conferma.

Origine: baseline Reqvire «Agreed technical choices», adottata; «Explicit supersession of decisions», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Sito del progetto coerente con documentazione e modello

Ogni affermazione sul prodotto del sito del progetto `ambrogio-app.github.io` deve concordare con `ambrogio-docs` e con il modello, una capability in stato `draft` deve esservi presentata soltanto come futura, e quando cambia una funzionalità descritta nel sito lo stesso lavoro deve aggiornarne la pagina ed eseguirne la build.

#### Details
Il sito non ha un modello: è la pagina d'ingresso del progetto, con ciò che Ambrogio fa e i collegamenti alla documentazione e ai repository, mentre i fatti dettagliati restano in `ambrogio-docs`.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Un solo modello attraverso i repository

Il modello Reqvire di Ambrogio deve essere uno solo, formato dalle cartelle `system-model/` di `ambrogio-model` e dei repository di prodotto affiancati in una cartella di lavoro, e deve essere letto, modificato e validato da quella cartella con collegamenti diretti fra repository; le dipendenze fra repository devono restare senza cicli, con `ambrogio-model` che non si collega a nessun repository di prodotto e il backend che non si collega ai client, e una modifica che tocca più repository deve usare lo stesso nome di branch in ciascuno.

#### Details
Un requisito di un client si collega al contratto del backend da cui dipende; un requisito locale raffina con `derivedFrom` la decisione comune di `ambrogio-model`. Nessun repository fissa una revisione di un altro, e le interfacce pubbliche del backend non hanno versioni coesistenti, secondo «Compatibilità fra release per versione d'interfaccia». Le pull request di una modifica che tocca più repository si integrano in ordine di dipendenza, a partire da `ambrogio-model`. `ambrogio-docs`, `ambrogio-homelab-example`, il sito `ambrogio-app.github.io`, il marchio `ambrogio-brand` e il video `ambrogio-video` non hanno un modello e non fanno parte del grafo. Con un solo grafo, validazione, copertura e analisi d'impatto vedono insieme gli obblighi di tutti i repository.

Le letture del modello con Reqvire si eseguono con `scripts/rv`, che usa la stessa copia temporanea dei controlli e rifiuta i comandi che modificano il modello; le modifiche con la CLI si eseguono sulla cartella di lavoro.

Origine: baseline Reqvire «One model per product across its repositories», adattata: `ambrogio-model` è la base del grafo e il backend non si collega ai client.

Origine: baseline Reqvire «Product-wide model repository at the base of the graph», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * satisfiedBy: [change-impact-composite](../../scripts/change-impact-composite)
  * satisfiedBy: [repo-deps](../../scripts/repo-deps)
  * satisfiedBy: [reqvire-workspace.sh](../../scripts/reqvire-workspace.sh)
  * satisfiedBy: [rv](../../scripts/rv)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Verifica automatica per default

Ogni requisito collegato con `satisfiedBy` alla propria realizzazione deve essere verificato da almeno una verifica, e ogni verifica di test di un tale requisito deve essere collegata con `satisfiedBy` al test o al controllo che la esegue; un requisito la cui verifica non è automatizzabile deve essere verificato da una verifica di ispezione, analisi o dimostrazione.

#### Details
Una verifica di test senza `satisfiedBy` descrive una prova che nessuno esegue, e Reqvire la conta comunque come verifica. Lo script di integrità del modello segnala ogni requisito realizzato senza verifica e ogni sua verifica di test senza `satisfiedBy`, e il controllo è bloccante.

Origine: baseline Reqvire «Automated verification by default», adattata: il controllo è bloccante senza modalità solo-report, perché le lacune del modello sono state chiuse nella stessa modifica che lo introduce.

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Verifiche manuali giustificate

Ogni verifica di ispezione, analisi o dimostrazione deve indicare il motivo per cui non è automatizzabile, in una frase che inizia con «Non automatizzabile:».

#### Details
Una verifica automatizzabile è una verifica di test. Reqvire registra che una verifica esiste, non che sia stata eseguita: una verifica manuale non ripetuta dopo una modifica lascia passare una violazione del requisito.

Origine: baseline Reqvire «Manual verifications justified», adattata: il marcatore è «Non automatizzabile:».

#### Metadata
  * type: requirement

#### Contract References
  * [Script di integrità del modello](../Contracts/ModelDrivenDevelopment.md#script-di-integrità-del-modello)

#### Relations
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Versione fissata di Reqvire

Lo sviluppo locale, gli hook e la CI di ogni repository di Ambrogio devono eseguire Reqvire alla stessa versione esatta, scritta soltanto in `.reqvire-version` di `ambrogio-model`, e gli script dello spazio di lavoro devono rifiutare una versione mobile.

#### Details
Il cambio di versione di Reqvire è una modifica esplicita di `ambrogio-model` che aggiorna insieme sviluppo e CI di tutti i repository. Il file `.gitignore` di `ambrogio-model` esclude dal repository la cartella `node_modules/` di un'installazione locale di Reqvire indicata con `REQVIRE`.

Origine: baseline Reqvire «Pinned Reqvire version», adattata: la versione si cerca soltanto in `.reqvire-version` di `ambrogio-model`, non alla radice della cartella di lavoro, che non è un repository, né in `.claude/settings.json`.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [.gitignore](../../.gitignore)
  * satisfiedBy: [.reqvire-version](../../.reqvire-version)
  * satisfiedBy: [reqvire-workspace.sh](../../scripts/reqvire-workspace.sh)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Visibilità dei repository decisa dalla persona

Agenti, workflow e strumenti dei repository di Ambrogio non devono rendere pubblico un repository o un pacchetto pubblicato né cambiarne la visibilità, che è decisa dalla persona.

#### Details
Origine: baseline Reqvire «Repository visibility decided by the owner», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [AGENTS.md](../../AGENTS.md)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

### Workflow GitHub Actions con privilegi e durata limitati

Ogni workflow GitHub Actions dei repository di Ambrogio deve concedere a ogni job soltanto i permessi del token necessari, eseguire le action esterne fissate al commit, limitare la durata di ogni job su un runner fissato, eseguire il checkout senza conservare le credenziali e, quando una pipeline di rilascio richiede i controlli, richiamare con `workflow_call` gli stessi workflow dei controlli invece di duplicarne i passi.

#### Details
Ogni repository di prodotto raffina questo requisito con l'elenco dei propri workflow, le durate e le protezioni proprie della pubblicazione.

Origine: baseline Reqvire «Least-privilege workflow token», adottata; «Workflow actions pinned by commit», adottata; «Time-limited check jobs», adottata; «Checkout without persisted credentials», adottata; «Check workflows reused by the release pipeline», adottata.

#### Metadata
  * type: requirement

#### Relations
  * satisfiedBy: [ci.yml](../../.github/workflows/ci.yml)
  * satisfiedBy: [secret-scan.yml](../../.github/workflows/secret-scan.yml)
  * specify: [Sviluppo governato dal modello](../Capabilities/Engineering.md#sviluppo-governato-dal-modello)
---

