# Elements

### Verifica degli strumenti e dei workflow di ambrogio-model

Raggruppa le verifiche degli script dello spazio di lavoro, dei workflow, dell'hook e del ruleset di `ambrogio-model`.

#### Metadata
  * type: verification-objective
---

### Ispezione dei workflow e dell'hook di ambrogio-model

Leggere `.github/workflows/ci.yml`, `.github/workflows/secret-scan.yml`, `.githooks/pre-commit` e `scripts/checkout-workspace` di `ambrogio-model` e confrontarli con i contratti; dopo un push su un branch e in una pull request osservare su GitHub Actions i job `Model checks` e `Gitleaks`; in un clone con gli hook attivi tentare un commit con un token fittizio generato per la prova, un commit con il modello non valido e un commit con `gitleaks` assente dal `PATH`.

#### Details
L'ispezione passa se i workflow dichiarano trigger, permessi, action fissate, runner, durate, checkout senza credenziali e `workflow_call` del profilo comune; se il job `Model checks` scarica affiancati gli altri repository sul branch omonimo o su `main` ed esegue i controlli dell'intero modello, e in una pull request scrive l'analisi d'impatto nel riepilogo; se il job `Gitleaks` recupera l'intera storia, verifica l'impronta dell'archivio prima di estrarlo e fallisce sui segreti senza riportarne il valore; e se l'hook rifiuta il commit con il token, il commit con il modello non valido e il commit senza `gitleaks`, con il messaggio che indica come installarlo. Fallisce se una di queste condizioni manca. Non automatizzabile: `ambrogio-model` non ha codice di prova né un runner dei test, e introdurli è una scelta tecnica da concordare con la persona; trigger, checkout del remoto ed esiti dei job si osservano soltanto su GitHub Actions dopo un push.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica degli strumenti e dei workflow di ambrogio-model](#verifica-degli-strumenti-e-dei-workflow-di-ambrogio-model)
  * verify: [Controlli CI dei repository di Ambrogio](../Requirements/ModelDrivenDevelopment.md#controlli-ci-dei-repository-di-ambrogio)
  * verify: [Controlli del modello prima del commit](../Requirements/ModelDrivenDevelopment.md#controlli-del-modello-prima-del-commit)
  * verify: [Controllo dei segreti prima del commit](../Requirements/ModelDrivenDevelopment.md#controllo-dei-segreti-prima-del-commit)
  * verify: [Scansione dei segreti nella CI](../Requirements/ModelDrivenDevelopment.md#scansione-dei-segreti-nella-ci)
  * verify: [Workflow GitHub Actions con privilegi e durata limitati](../Requirements/ModelDrivenDevelopment.md#workflow-github-actions-con-privilegi-e-durata-limitati)
---

### Ispezione della protezione del merge di ambrogio-model

Leggere con `gh api repos/ambrogio-app/ambrogio-model/rulesets` e con il dettaglio del ruleset `main` le regole attive sul branch principale di `ambrogio-model`.

#### Details
L'ispezione passa se il ruleset corrisponde al contratto: applicazione attiva sul branch predefinito, nessun attore escluso, integrazione solo tramite pull request, controlli richiesti `Model checks` e `Gitleaks`, riscrittura forzata e cancellazione vietate; e se un push diretto sul branch principale viene rifiutato. Fallisce se il ruleset manca, è disattivato, ha attori esclusi o differisce dal contratto. Non automatizzabile: il ruleset è un'impostazione del repository GitHub e non un file del repository, e leggerlo richiede credenziali con accesso amministrativo che la CI non possiede.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica degli strumenti e dei workflow di ambrogio-model](#verifica-degli-strumenti-e-dei-workflow-di-ambrogio-model)
  * verify: [Controlli obbligatori prima del merge](../Requirements/ModelDrivenDevelopment.md#controlli-obbligatori-prima-del-merge)
---

### Prova dei controlli del modello dello spazio di lavoro

Eseguire `scripts/model-checks` sulla cartella di lavoro con tutti i repository del modello affiancati, come fanno la CI di ogni repository e l'hook pre-commit di `ambrogio-model`; ripetere con `.reqvire-version` che indica `latest`.

#### Details
La prova passa se la validazione riesce, il lint non riporta elementi `auto_fixable` né `needs_manual_review`, lo script di integrità non segnala storia delle decisioni, formule non normative, contratti con alternative o motivazioni, verifiche manuali senza «Non automatizzabile:» né file di governo non riferiti dal modello, il grafo fra repository non ha cicli e lo script termina con stato 0; e se con una versione mobile lo script termina con esito non riuscito senza eseguire Reqvire. Fallisce se uno dei controlli segnala una violazione, se lo script termina con stato 0 nonostante una violazione o se accetta una versione mobile.

#### Metadata
  * type: test-verification

#### Relations
  * derivedFrom: [Verifica degli strumenti e dei workflow di ambrogio-model](#verifica-degli-strumenti-e-dei-workflow-di-ambrogio-model)
  * satisfiedBy: [check-model.mjs](../../scripts/check-model.mjs)
  * satisfiedBy: [model-checks](../../scripts/model-checks)
  * satisfiedBy: [repo-deps](../../scripts/repo-deps)
  * satisfiedBy: [reqvire-workspace.sh](../../scripts/reqvire-workspace.sh)
  * verify: [Controllo automatico dell'integrità del modello](../Requirements/ModelDrivenDevelopment.md#controllo-automatico-dellintegrità-del-modello)
  * verify: [Decisioni sostituite rimosse nella stessa modifica](../Requirements/ModelDrivenDevelopment.md#decisioni-sostituite-rimosse-nella-stessa-modifica)
  * verify: [File di governo collegati al modello](../Requirements/ModelDrivenDevelopment.md#file-di-governo-collegati-al-modello)
  * verify: [Formulazione normativa degli obblighi](../Requirements/ModelDrivenDevelopment.md#formulazione-normativa-degli-obblighi)
  * verify: [Motivazioni nei dettagli del requisito](../Requirements/ModelDrivenDevelopment.md#motivazioni-nei-dettagli-del-requisito)
  * verify: [Un solo modello attraverso i repository](../Requirements/ModelDrivenDevelopment.md#un-solo-modello-attraverso-i-repository)
  * verify: [Verifiche manuali giustificate](../Requirements/ModelDrivenDevelopment.md#verifiche-manuali-giustificate)
  * verify: [Versione fissata di Reqvire](../Requirements/ModelDrivenDevelopment.md#versione-fissata-di-reqvire)
---

### Verifica del governo del modello

Raggruppa le verifiche delle regole di processo, di integrità del modello e di integrazione comuni ai repository di Ambrogio.

#### Metadata
  * type: verification-objective
---

### Ispezione dei contenuti pubblicati nella pull request

Durante la revisione di ogni pull request, leggere i testi aggiunti o modificati in modello, codice, test, esempi, messaggi di commit e documentazione, gli esiti della scansione dei segreti e le impostazioni di visibilità toccate da workflow o strumenti.

#### Details
L'ispezione passa se i testi non riportano indirizzi, nomi host, domini, percorsi personali, credenziali, identificativi di dispositivi o entità, nomi di stanze o configurazioni effettive di un'installazione; se esempi ed evidenze usano valori segnaposto o descrizioni generiche e non introducono modifiche provate su un'installazione reale senza decisione della persona; se gli esempi distribuiti sono in inglese salvo i valori richiesti in italiano; se un ritrovamento di segreti è risolto con la rimozione e un falso positivo con un'eccezione registrata nel modello; e se nessun workflow o strumento cambia la visibilità di un repository o di un pacchetto. Fallisce se una di queste condizioni manca. Non automatizzabile: riconoscere un dato di installazione, la lingua di un testo o un'eccezione non concordata richiede di leggere i testi; gitleaks copre soltanto le credenziali riconoscibili.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Dati di installazione esclusi dagli artefatti del progetto](../Requirements/ModelDrivenDevelopment.md#dati-di-installazione-esclusi-dagli-artefatti-del-progetto)
  * verify: [Esempi distribuiti in inglese](../Requirements/ModelDrivenDevelopment.md#esempi-distribuiti-in-inglese)
  * verify: [Ritrovamenti di segreti risolti con la rimozione](../Requirements/ModelDrivenDevelopment.md#ritrovamenti-di-segreti-risolti-con-la-rimozione)
  * verify: [Visibilità dei repository decisa dalla persona](../Requirements/ModelDrivenDevelopment.md#visibilità-dei-repository-decisa-dalla-persona)
---

### Ispezione dei contratti esterni

Durante la revisione di ogni modifica che aggiunge o aggiorna una dipendenza da un servizio, un protocollo, un'API esterna o un modello scaricato o distribuito, e alla preparazione di ogni release, esaminare gli elementi `source` dei repository interessati, i requisiti e i contratti che li citano e le prove d'integrazione collegate.

#### Details
L'ispezione passa se ogni contratto esterno da cui il repository dipende ha un elemento `source` posseduto da un suo requisito, con versione, origine dell'informazione e prova d'integrazione; se i requisiti che possiedono contratti dipendenti lo citano con una Contract Reference e i testi non ne ripetono la versione, salvo i valori d'esempio; se una versione cambiata lo è nell'elemento `source` con la prova d'integrazione ripetuta; e se nessun collegamento punta fuori dalla cartella di lavoro. Fallisce se una dipendenza esterna non ha un elemento o non ne dichiara la versione, se un testo ripete una versione registrata, se una versione è cambiata senza modificare l'elemento o se un collegamento punta all'esterno. Non automatizzabile: riconoscere quali dipendenze sono esterne al prodotto e se la versione dichiarata corrisponde a quella usata dall'integrazione richiede di leggere codice, configurazione e documentazione dei fornitori.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Contratti esterni registrati con la loro versione](../Requirements/ModelDrivenDevelopment.md#contratti-esterni-registrati-con-la-loro-versione)
---

### Ispezione del metodo nella pull request

Durante la revisione di ogni pull request, confrontare i commit, la descrizione e le modifiche di tutti i repository coinvolti con il modello: ordine dei commit fra modello e codice, decisioni tecniche nuove, controlli eseguiti, branch usati e pagine di `ambrogio-docs` aggiornate.

#### Details
L'ispezione passa se ogni comportamento o scelta tecnica implementati sono registrati nel modello nella stessa modifica o prima; se ogni scelta tecnica nuova è indicata come concordata con la persona e ogni sostituzione è esplicita; se le modifiche del modello sono state fatte con la CLI Reqvire alla versione fissata e passano per commit con gli hook attivi; se la descrizione riporta i controlli eseguiti in locale, l'analisi d'impatto composita e la revisione degli elementi segnalati; se una modifica su più repository usa lo stesso branch in ciascuno; e se un cambiamento pubblico è accompagnato dall'aggiornamento di `ambrogio-docs` con la sua build. Fallisce se una di queste condizioni manca. Non automatizzabile: stabilire se una scelta tecnica è nuova, se è stata concordata e se un cambiamento è pubblico richiede di confrontare il significato della modifica con il modello e con le decisioni della persona.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Controlli prima dell'integrazione](../Requirements/ModelDrivenDevelopment.md#controlli-prima-dellintegrazione)
  * verify: [Documentazione utente aggiornata con i cambiamenti pubblici](../Requirements/ModelDrivenDevelopment.md#documentazione-utente-aggiornata-con-i-cambiamenti-pubblici)
  * verify: [Modello modificato soltanto con la CLI Reqvire](../Requirements/ModelDrivenDevelopment.md#modello-modificato-soltanto-con-la-cli-reqvire)
  * verify: [Ordine di lavoro guidato dal modello](../Requirements/ModelDrivenDevelopment.md#ordine-di-lavoro-guidato-dal-modello)
  * verify: [Scelte tecniche concordate con la persona](../Requirements/ModelDrivenDevelopment.md#scelte-tecniche-concordate-con-la-persona)
  * verify: [Un solo modello attraverso i repository](../Requirements/ModelDrivenDevelopment.md#un-solo-modello-attraverso-i-repository)
---

### Ispezione del registro della baseline

Durante la revisione di ogni modifica che aggiunge o cambia una riga d'origine o il registro della baseline, confrontare i nomi citati con `CATALOG.md` della baseline al commit del registro e controllare che nessun link del modello punti alla baseline.

#### Details
L'ispezione passa se ogni nome citato in una riga d'origine compare nel catalogo al commit adottato, se ogni riga indica adottata o adattata con ciò che cambia, se il registro elenca i temi e le decisioni non adottati con il motivo e nessuna decisione adottata, e se nessun elemento si collega alla baseline. Fallisce se un nome non è nel catalogo, se manca lo stato o il motivo, o se esiste un link verso la baseline. Non automatizzabile: la baseline non fa parte della cartella di lavoro e il confronto fra il significato di un requisito e quello della decisione d'origine richiede di leggerli; la persona ha escluso un controllo automatico dei nomi.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Decisioni tratte dalla baseline Reqvire](../Requirements/ModelDrivenDevelopment.md#decisioni-tratte-dalla-baseline-reqvire)
---

### Ispezione delle decisioni sostituite

Durante la revisione di ogni modifica che registra una decisione in sostituzione di un'altra, cercare nell'intero modello gli elementi che affermano la decisione sostituita, con `scripts/change-impact-composite` e con una ricerca testuale dei suoi termini chiave in ogni repository.

#### Details
L'ispezione passa se, dopo la modifica, nessun requisito, contratto o verifica di alcun repository afferma ancora la decisione sostituita. Fallisce se un elemento la afferma ancora. Non automatizzabile: riconoscere che un testo afferma una decisione sostituita richiede di leggerlo; lo script copre soltanto date e formule di storia.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Decisioni sostituite rimosse nella stessa modifica](../Requirements/ModelDrivenDevelopment.md#decisioni-sostituite-rimosse-nella-stessa-modifica)
---

### Ispezione delle dipendenze fra contratti

Durante la revisione di ogni modifica che aggiunge o modifica un contratto, leggere il contratto e i contratti dei requisiti da cui dipende, anche in altri repository, ed eseguire `scripts/change-impact-composite` sulla modifica.

#### Details
L'ispezione passa se il contratto afferma soltanto la decisione del proprio requisito e ogni dipendenza da un contratto posseduto da un altro requisito è dichiarata come Contract Reference dal requisito proprietario del contratto dipendente, nella direzione ammessa fra repository, così che l'analisi d'impatto la segnali. Fallisce se un contratto ripete contenuto posseduto da un altro requisito o se una dipendenza non è dichiarata. Non automatizzabile: stabilire se due testi affermano lo stesso fatto richiede di leggerli.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Dipendenze fra contratti dichiarate come riferimenti](../Requirements/ModelDrivenDevelopment.md#dipendenze-fra-contratti-dichiarate-come-riferimenti)
---

### Ispezione delle istruzioni per gli agenti

Durante la revisione di ogni modifica di un `AGENTS.md` o di un requisito di processo, leggere `AGENTS.md` di `ambrogio-model` e degli altri repository e confrontarli con i requisiti della capability «Sviluppo governato dal modello» e con `scripts/check-model.mjs` per la presenza dei file di governo nel modello.

#### Details
L'ispezione passa se ogni `AGENTS.md` è riferito dal modello, se le istruzioni di `ambrogio-model` enunciano le regole di processo dei requisiti di quella capability e se le istruzioni dei repository di prodotto non le contraddicono e vi aggiungono soltanto indicazioni proprie del repository. Fallisce se un `AGENTS.md` non è riferito, contraddice un requisito o omette una regola che i requisiti assegnano alle istruzioni. Non automatizzabile: stabilire che istruzioni in prosa enunciano o contraddicono un requisito richiede di leggerle; lo script controlla soltanto i file di governo per percorso e non comprende gli `AGENTS.md`.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Controlli prima dell'integrazione](../Requirements/ModelDrivenDevelopment.md#controlli-prima-dellintegrazione)
  * verify: [Dati di installazione esclusi dagli artefatti del progetto](../Requirements/ModelDrivenDevelopment.md#dati-di-installazione-esclusi-dagli-artefatti-del-progetto)
  * verify: [Decisioni tratte dalla baseline Reqvire](../Requirements/ModelDrivenDevelopment.md#decisioni-tratte-dalla-baseline-reqvire)
  * verify: [Documentazione utente aggiornata con i cambiamenti pubblici](../Requirements/ModelDrivenDevelopment.md#documentazione-utente-aggiornata-con-i-cambiamenti-pubblici)
  * verify: [Esempi distribuiti in inglese](../Requirements/ModelDrivenDevelopment.md#esempi-distribuiti-in-inglese)
  * verify: [File di governo collegati al modello](../Requirements/ModelDrivenDevelopment.md#file-di-governo-collegati-al-modello)
  * verify: [Modello modificato soltanto con la CLI Reqvire](../Requirements/ModelDrivenDevelopment.md#modello-modificato-soltanto-con-la-cli-reqvire)
  * verify: [Ordine di lavoro guidato dal modello](../Requirements/ModelDrivenDevelopment.md#ordine-di-lavoro-guidato-dal-modello)
  * verify: [Ritrovamenti di segreti risolti con la rimozione](../Requirements/ModelDrivenDevelopment.md#ritrovamenti-di-segreti-risolti-con-la-rimozione)
  * verify: [Scelte tecniche concordate con la persona](../Requirements/ModelDrivenDevelopment.md#scelte-tecniche-concordate-con-la-persona)
  * verify: [Visibilità dei repository decisa dalla persona](../Requirements/ModelDrivenDevelopment.md#visibilità-dei-repository-decisa-dalla-persona)
---

### Ispezione delle versioni d'interfaccia di una release

Alla preparazione di ogni release di un repository di prodotto, confrontare le versioni del protocollo conversazionale e dell'API HTTP pubblica dichiarate dalla release con i contratti del backend e con `ambrogio-docs/reference/versions.md`, e confrontare i contratti delle interfacce pubbliche del backend modificati dalla release precedente con le modifiche dei client che le usano.

#### Details
L'ispezione passa se la release dichiara le versioni d'interfaccia offerte o usate; se la tabella della documentazione le riporta e indica quali release funzionano insieme; se ogni cambio incompatibile di un'interfaccia pubblica è fatto nella stessa modifica dei client che la usano, rilasciati insieme al backend, e cambia la versione maggiore nel nome dell'interfaccia quando il nome la porta; e se il modello e il codice del backend non conservano versioni precedenti di un'interfaccia. Fallisce se una versione manca, se la tabella non corrisponde, se un cambio incompatibile lascia un client che usa l'interfaccia senza aggiornamento o mantiene la versione maggiore nel nome, o se resta una versione precedente. Non automatizzabile: stabilire se una modifica di un contratto è incompatibile richiede di leggerne il significato.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Compatibilità fra release per versione d'interfaccia](../Requirements/ModelDrivenDevelopment.md#compatibilità-fra-release-per-versione-dinterfaccia)
---

### Ispezione di licenze, sito e marchio

Durante la revisione di ogni pull request che tocca un repository di Ambrogio, controllare il file `LICENSE` e i contenuti di terzi aggiunti, leggere le affermazioni sul prodotto aggiunte o modificate nel sito e confrontarle con `ambrogio-docs` e con il modello, ed eseguire dalla cartella di lavoro `ambrogio-brand/scripts/sync --check` quando la modifica tocca il marchio o una sua copia.

#### Details
L'ispezione passa se il repository ha il testo della licenza MIT in `LICENSE`, se ogni contenuto di terzi conserva la propria licenza ed è indicato con la sua origine nel README, se ogni affermazione del sito concorda con la documentazione e con il modello e presenta come futura soltanto una capability in stato `draft`, se `sync --check` è superato e se sito e documentazione hanno soltanto il tema chiaro. Fallisce se una di queste condizioni manca. Non automatizzabile: stabilire se un'affermazione concorda con la documentazione o se un contenuto è di terzi richiede di leggerli, e `sync --check` non può essere eseguito dalla CI dei repository pubblici, che non legge il repository privato `ambrogio-brand`.

#### Metadata
  * type: inspection-verification

#### Relations
  * derivedFrom: [Verifica del governo del modello](#verifica-del-governo-del-modello)
  * verify: [Licenza MIT del progetto](../Requirements/ModelDrivenDevelopment.md#licenza-mit-del-progetto)
  * verify: [Marchio da un'unica fonte](../Requirements/ModelDrivenDevelopment.md#marchio-da-ununica-fonte)
  * verify: [Sito del progetto coerente con documentazione e modello](../Requirements/ModelDrivenDevelopment.md#sito-del-progetto-coerente-con-documentazione-e-modello)
---
