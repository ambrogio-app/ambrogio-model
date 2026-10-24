# Elements

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

I test di un componente in layer devono importare codice di produzione, anche soltanto per i tipi, secondo il layer provato: i test Domain soltanto dal Domain, i test Application soltanto da Application e Domain, i test di un adapter inbound soltanto dal proprio adapter e da Application, i test di un adapter outbound soltanto dal proprio adapter, da Application e da Domain.

#### Details
Test runner, librerie di asserzione, tecnologie usate dagli adapter e fake locali non sono codice di produzione. Le prove di integrazione della composition root e fra componenti attraversano i layer e restano escluse.

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

I file del codice di produzione devono seguire una convenzione esplicita e uniforme che renda riconoscibili i casi d'uso e gli adapter secondo la responsabilità effettivamente realizzata.

#### Details
Origine: baseline Reqvire «Production file names by architectural role», adattata: senza un suffisso obbligatorio per i file delle porte.

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
