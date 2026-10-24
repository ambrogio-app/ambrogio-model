# Elements

### Adapter e trasporti provati sulla tecnologia reale

Quando una garanzia di un adapter dipende da una tecnologia concreta, i test che la dimostrano devono esercitare il contratto pubblico dell'adapter contro quella tecnologia, con oracoli di lettura e di scrittura indipendenti dal codice provato, senza mock profondi e senza considerare prova il solo giro di andata e ritorno; i test di un trasporto inbound devono provare lettura, validazione, invocazione, uscita ed errori attraverso il framework reale del trasporto con un caso d'uso controllato, senza considerare prova la chiamata diretta di un gestore.

#### Details
I test dei soli mapping e quelli dell'intero confine restano livelli distinti. Si applica ai repository di prodotto con adapter o trasporti: il backend per l'archivio SQLite, il server HTTP e le sessioni WebSocket; il satellite per il canale conversazionale e i modelli ONNX; i client testuali per i propri adapter verso il backend.

Origine: baseline Reqvire «Adapters tested at the real boundary», adattata: le tecnologie che richiedono periferiche fisiche, come l'audio del satellite, o servizi esterni con credenziali, come i fornitori dei modelli linguistici, si provano con dimostrazioni registrate nel modello o con l'ingresso di prova pubblico del backend invece che nella suite automatica; «Transports tested with their real framework», adattata: la regola sugli ingressi equivalenti di trasporti diversi per la stessa intenzione non si applica, perché ogni intenzione del backend ha un solo trasporto.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Artefatti compilati provati come processi

Per ogni punto d'ingresso eseguibile con Node.js che un repository di prodotto distribuisce, una piccola suite deve avviare l'artefatto compilato come processo e verificarne la risoluzione dei moduli, l'avvio, un'operazione riuscita rappresentativa e un fallimento, usando la persistenza reale quando l'operazione rappresentativa la attraversa, mentre le matrici dettagliate dei casi restano nei test dei singoli confini.

#### Details
L'esecuzione diretta dei sorgenti TypeScript non prova il codice distribuito. Il backend, il satellite e il client terminale raffinano questo requisito con la propria suite; la chat web è servita come file statici e non ha un punto d'ingresso Node.js.

Origine: baseline Reqvire «Compiled artifacts tested as processes», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Capacità dell'ambiente fornite dalla composition root

La composition root di ogni processo di Ambrogio deve scegliere e assemblare le implementazioni delle porte e le risorse tecniche, e Application deve ottenere identificativi, istanti e scadenze tramite capacità fornite dalla composition root, senza invocare direttamente generatori, orologi o timer dell'ambiente.

#### Details
Origine: baseline Reqvire «Port assembly in the composition root», adottata; «Identifier generation before Domain», adattata: la stessa regola vale per istanti e scadenze; «Explicit current time provision», adattata: la stessa regola vale per identificativi e scadenze.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Contratti Application nei termini del componente

Quando un adapter interagisce con un caso d'uso, deve usare dati di ingresso e di uscita definiti in Application e tradurvi i propri formati di protocollo; ogni porta Application deve essere nominata e descritta nei termini della capacità richiesta dal componente, senza il nome, i tipi o le chiamate del prodotto, del protocollo o della libreria che la realizza.

#### Details
Origine: baseline Reqvire «Use-case data independent of inbound formats», adottata; «Port names by required capability», adottata; «Port contracts in module terms», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Costruzione separata dall'attivazione

La costruzione di un ingresso di un processo di servizio di Ambrogio deve restituire le capacità utilizzabili dell'ingresso e una funzione di chiusura senza avviarne l'attivazione esterna, come l'ascolto su una porta o l'acquisizione dal microfono, e l'entrypoint del processo deve coordinare l'attivazione e l'esito del processo.

#### Details
Origine: baseline Reqvire «Construction separate from activation», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Ciclo di vita dei processi di servizio con Node.js](../Contracts/HomelabInstallation.md#ciclo-di-vita-dei-processi-di-servizio-con-nodejs)

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Diagnosi definitiva unica dei guasti inattesi

Quando un guasto inatteso raggiunge il confine tecnico che ne decide l'esito, quel confine deve emettere al massimo una diagnosi definitiva, con l'`Error` che rappresenta il guasto nel campo `err` serializzato senza modificare l'errore originale né la sua catena di cause, e i componenti intermedi che lo propagano non devono registrarlo.

#### Details
Origine: baseline Reqvire «Single definitive diagnostic log owned by the deciding boundary», adottata; «No definitive logs in intermediate components», adottata; «Error object in the err field of the definitive log», adottata; «Original error preserved during serialization», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Domain e casi d'uso senza logger

Il codice Domain e i casi d'uso Application dei componenti in layer non devono dipendere da un logger.

#### Details
Origine: baseline Reqvire «No logger in domain and use cases», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Esiti previsti come valori tipizzati

Quando un'operazione Domain, un caso d'uso Application, una porta o un'operazione del nucleo di un client prevede un esito negativo nel proprio contratto, deve restituirlo come valore `Result` distinguibile dal successo, con varianti di rifiuto distinte da un campo `kind`, e le eccezioni devono restare riservate ai guasti inattesi.

#### Details
Il backend, il satellite e la chat web raffinano questo requisito con la forma del proprio tipo `Result` e le regole proprie sulle varianti.

Origine: baseline Reqvire «Expected rejections as outcome values», adottata; «Literal kind discriminant for rejection variants», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Esiti previsti senza log di errore automatici

Quando un componente gestisce un esito previsto, non deve emettere automaticamente un log di livello `warn` o `error` per il solo verificarsi di quell'esito.

#### Details
Origine: baseline Reqvire «No automatic log for expected outcomes», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Forma TypeScript dei contratti Application

Quando Application dichiara una porta a oggetto con operazioni nominate, deve usare `interface`; quando dichiara dati, unioni o contratti callable, deve usare `type`.

#### Details
Origine: baseline Reqvire «TypeScript shape of Application contracts», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Gestione esplicita dei rifiuti previsti

I chiamanti delle porte e dei casi d'uso devono gestire esplicitamente ogni variante di rifiuto previsto dichiarata dal contratto chiamato, e un adapter inbound deve rappresentare soltanto le varianti dichiarate dal caso d'uso Application che invoca.

#### Details
Origine: baseline Reqvire «Explicit handling of port rejections», adottata; «Exhaustive rejection handling in inbound adapters», adottata; «Application variants in inbound adapter outcomes», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Guasti inattesi propagati come eccezioni

Quando si verifica un guasto inatteso, il componente che lo rileva deve propagarlo come eccezione fino al confine tecnico che lo gestisce, e un contesto aggiunto al guasto deve conservare il valore originale come `cause` di un nuovo `Error`.

#### Details
Origine: baseline Reqvire «Propagation of unexpected failures as exceptions», adottata; «Operational context with Error and cause», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Import del codice di produzione nei test per layer

I test di un componente in layer devono importare codice di produzione, anche soltanto per i tipi, secondo il layer del file che verificano: i test Domain soltanto dal Domain, i test Application soltanto da Application e Domain, i test di un adapter inbound soltanto dal proprio adapter e da Application, i test di un adapter outbound soltanto dal proprio adapter, da Application e da Domain.

#### Details
Il layer provato da un test è quello del file di produzione che il test verifica, cioè della cartella in cui il test risiede accanto a quel file secondo «Suite di test con Vitest». Test runner, librerie di asserzione, tecnologie usate dagli adapter e fake locali non sono codice di produzione. Le prove di integrazione della composition root e fra componenti attraversano i layer e restano escluse.

Origine: baseline Reqvire «Domain test imports», adottata; «Application test imports», adottata; «Inbound adapter test imports», adottata; «Outbound adapter test imports», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Indipendenza tecnica di Domain e Application

Il codice di produzione Domain e Application di ogni componente in layer deve usare soltanto API standard ECMAScript indipendenti dall'ambiente, senza dipendere da API Node.js, da package npm usati a runtime o da librerie tecniche, anche tramite import di soli tipi; Domain deve importare soltanto Domain dello stesso componente e Application soltanto Application e Domain dello stesso componente.

#### Details
Origine: baseline Reqvire «Technical independence of Domain and Application», adottata; «Domain imports restricted to the module Domain», adottata; «Application imports restricted to the module», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Interfaccia minima del logger con un solo logger di base

I componenti tecnici di Ambrogio che registrano eventi diagnostici devono ricevere un'interfaccia strutturale minima del logger con `debug`, `info`, `warn`, `error` e la creazione di un logger derivato con campi fissi, senza dipendere dall'API della libreria di logging; la composition root di ogni processo deve creare e condividere un solo logger di base per l'intero grafo del processo, un logger derivato deve aggiungere contesto senza modificare il logger di base né un altro logger derivato, e la configurazione del logger di base deve oscurare i valori dei campi dal nome sensibile.

#### Details
Il backend e il satellite raffinano questo requisito con il proprio logger di base. Domain e casi d'uso restano senza logger secondo «Domain e casi d'uso senza logger».

Origine: baseline Reqvire «Minimal logger interface with one base logger», adattata: l'oscuramento riconosce i campi sensibili dallo schema del nome a ogni profondità invece che da un elenco di percorsi, per coprire i nomi delle variabili delle credenziali scelti da chi installa.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Log affidati al deployment

Quando un'installazione richiede raccolta, conservazione o inoltro dei log tecnici, queste funzioni devono essere configurate nel deployment, senza integrare nel codice dei componenti archivi o servizi di raccolta specifici.

#### Details
Origine: baseline Reqvire «Log forwarding left to the deployment», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Log tecnici JSON con Pino

Quando un componente di Ambrogio emette un evento diagnostico tecnico, deve usare Pino e scrivere una sola riga JSON con un campo `event` dal nome stabile e soltanto i campi diagnostici scelti esplicitamente, senza acquisire automaticamente contenuti delle conversazioni o credenziali.

#### Details
Ogni componente raffina questo requisito con il proprio flusso di uscita e le esclusioni proprie, per esempio corpi HTTP nel backend e audio nel satellite.

Origine: baseline Reqvire «Pino as technical logger», adottata; «Single-line JSON technical log events», adottata; «Stable diagnostic event names», adottata; «Explicit selection of diagnostic fields», adottata; «No automatic capture of sensitive data in logs», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Nomi dei file secondo il ruolo architetturale

I file del codice di produzione devono seguire una convenzione esplicita e uniforme che renda riconoscibili i casi d'uso, le porte e gli adapter secondo la responsabilità effettivamente realizzata.

#### Details
Origine: baseline Reqvire «Production file names by architectural role», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Nucleo provato dagli ingressi pubblici con fixture locali

I test Domain di un componente in layer devono usare oggetti Domain reali e valori deterministici e verificare il comportamento pubblico, e i test dei casi d'uso devono costruire il caso d'uso dal suo ingresso pubblico con piccoli fake delle porte scritti nel test, senza sostituire moduli, senza container di dependency injection, database, server o rete e senza verificare dettagli privati; fixture, fake e builder dei test di ogni repository di prodotto devono essere piccoli, locali al componente o alla suite e deterministici, senza dipendere dal tempo reale, da casualità non controllata, dall'ordine dei test o da residui di altri test, e devono costruire gli oggetti business attraverso i loro ingressi pubblici di creazione o ricostruzione.

#### Details
Per ogni regola significativa del Domain i test provano un caso ammesso, un caso rifiutato e i valori di confine pertinenti. I moduli di supporto condivisi da più test di un repository restano nella sua cartella `test/support/` e non diventano un package di utilità dei test.

Origine: baseline Reqvire «Core tested through public entry points», adattata: i fake delle porte registrano le chiamate anche con le funzioni registratrici del runner, come `vi.fn` di Vitest, sempre definite nel test; è esclusa la sostituzione dei moduli con `vi.mock`; «Local deterministic fixtures», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Perimetro iniziale dei segnali di osservabilità

Nella prima versione ogni componente di Ambrogio deve usare come segnali di osservabilità i log tecnici strutturati, senza introdurre sistemi separati di metriche, tracing distribuito o audit degli eventi.

#### Details
Un'estensione richiede un bisogno concreto, requisiti e contratti propri e verifiche dedicate. Ogni componente raffina questo requisito con i propri segnali, per esempio gli identificativi di correlazione del backend.

Origine: baseline Reqvire «Logs as the only initial observability signal», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Regole di architettura centrali e bloccanti

Ogni repository di prodotto con regole di architettura sugli import deve tenerle in un'unica fonte centrale della propria suite di test, ciascuna con un nome stabile, controllate a ogni esecuzione della suite sull'intero grafo degli import dei sorgenti e dei test del repository, compresi gli import di soli tipi, con almeno una fixture negativa per regola che fallisce con il nome della regola attesa; un'eccezione deve essere una voce esplicita della configurazione centrale con il nome della regola, l'import ammesso e il motivo, registrata nel contratto delle regole del repository, e l'analisi non deve limitarsi ai file modificati né ridursi ad avvisi.

#### Details
Si applica al backend e al satellite, che hanno componenti in layer; ciascuno raffina questo requisito con il contratto che elenca i nomi delle proprie regole e le eccezioni ammesse. Una violazione fa fallire la suite di test, quindi la CI e il comando di verifica completo.

Origine: baseline Reqvire «Central blocking architecture rules», adattata: le regole sono controlli della suite Vitest sul testo dei sorgenti invece della configurazione di dependency-cruiser.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Serializzazione controllata di err

Quando il logger di un componente di Ambrogio emette la riga JSON di un log diagnostico definitivo, la riga deve contenere una rappresentazione del campo `err` conforme al profilo controllato di serializzazione, che mostra tipo, messaggio e stack soltanto per gli errori costruiti dal progetto e una descrizione costante per ogni altro valore.

#### Details
Il backend e il satellite raffinano questo requisito con la propria classe di errore del progetto e la propria descrizione costante.

Origine: baseline Reqvire «Controlled serialization of err», adattata: l'errore del progetto che raccoglie i guasti indipendenti del ciclo di vita mostra anche le viste dei guasti raccolti.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Struttura in layer dei componenti

Ogni componente di Ambrogio organizzato in layer deve collocare regole e stati in Domain, casi d'uso e porte in Application e integrazioni tecniche negli adapter; quando un caso d'uso richiede una capacità tecnica esterna, Application deve dichiarare una porta per quella capacità e un adapter deve realizzarne l'integrazione concreta.

#### Details
Il backend e il satellite sono organizzati in layer e raffinano questo requisito; la chat web ha un'architettura propria per funzionalità.

Origine: baseline Reqvire «Domain Application and adapter separation», adottata; «External integration through ports and adapters», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Sufficienza dei test giudicata dai comportamenti

La sufficienza della suite di test di ogni repository di prodotto deve essere giudicata dai comportamenti osservabili richiesti dalle verifiche del modello, e una soglia numerica globale di copertura non deve sostituire quei test né essere trattata come prova di pulizia delle risorse, di gestione degli errori o di garanzie.

#### Details
I rapporti di copertura del codice, se prodotti, sono soltanto informativi; nessun repository di prodotto dichiara una soglia di copertura nella configurazione dei test o nella CI.

Origine: baseline Reqvire «Sufficiency judged by behaviours», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Suite di test con Vitest accanto al codice

Ogni repository di prodotto con componenti in layer deve eseguire la propria suite automatica con Vitest come unico runner, con ogni file di test accanto al file che verifica secondo il contratto «Suite di test con Vitest», selezioni veloci, di integrazione e dei processi compilati separate e tutte comprese nel comando di verifica completo, senza che un file di test sia eseguito da più di una selezione.

#### Details
Si applica al backend e al satellite, ciascuno dei quali raffina questo requisito con le proprie selezioni e i propri script. Il client terminale e la chat web mantengono la disposizione dei test registrata nei rispettivi contratti.

Origine: baseline Reqvire «Vitest as test runner», adattata: le prove di integrazione usano un database SQLite reale invece di PostgreSQL; i test che non verificano un solo file sorgente, i moduli di supporto condivisi e le prove dell'intero repository hanno cartelle `test/` dedicate.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---

### Uso delle sole interfacce pubbliche del backend

Quando un client conversazionale di Ambrogio comunica con il backend, deve usare soltanto le interfacce pubbliche del backend, cioè il protocollo conversazionale e le API HTTP pubbliche definite dai contratti del backend, e il codice di produzione del client non deve importare codice del backend.

#### Details
Ogni client raffina questo requisito con le Contract References ai contratti del backend che usa e con una prova automatica che il proprio codice di produzione non importi codice del backend. Le prove di integrazione dei client usano l'ingresso di prova pubblico registrato dal backend. La compatibilità fra release segue «Compatibilità fra release per versione d'interfaccia».

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Backend](../Thesaurus/Lessico.md#backend)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Architettura del codice](../Capabilities/Engineering.md#architettura-del-codice)
---
