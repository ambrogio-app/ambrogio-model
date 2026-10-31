# Elements

### Lessico Ambrogio

Termini condivisi del prodotto Ambrogio: la famiglia e l'installazione, le conversazioni e i loro turni, gli agenti e i connettori, la voce, il backend e i client conversazionali.

#### Metadata
  * type: concept-scheme
  * concept_base: https://github.com/ambrogio-app/ambrogio-model/concepts
  * concept_prefix: ambrogio
---

### Agente

Componente conversazionale di Ambrogio che usa un modello linguistico e istruzioni per elaborare una richiesta. L'orchestratore sceglie l'agente che risponde; gli agenti specializzati formulano le risposte, con o senza un collegamento a un server MCP.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
---

### Agente orchestratore

Agente che riceve la richiesta conversazionale della famiglia e sceglie, tra gli agenti specializzati, quello che deve rispondere, senza formulare esso stesso la risposta; la risposta dell'agente scelto è la risposta alla famiglia.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * broader: [Agente](#agente)
---

### Backend

Servizio di Ambrogio eseguito nell'installazione che gestisce conversazioni, agenti, connettori e voce, conserva lo storico delle conversazioni ed espone ai client conversazionali il protocollo conversazionale e le API HTTP pubbliche.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Installazione](#installazione)
---

### Client conversazionale

Programma con cui la famiglia conversa con Ambrogio comunicando con il backend soltanto tramite le sue interfacce pubbliche. I client di Ambrogio sono il satellite vocale, il client terminale e la chat web facoltativa.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Backend](#backend)
---

### Connettore MCP

Agente specializzato di Ambrogio configurato con un modello linguistico e un collegamento client a un server MCP. Usa i tool di quel server per svolgere compiti affidati dall'orchestratore durante la conversazione. Memory è il connettore di cui Ambrogio fornisce anche il server MCP; gli altri usano server MCP di terzi, come quelli degli esempi distribuiti.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * broader: [Agente](#agente)
---

### Conversazione

Sequenza persistente di scambi testuali tra la famiglia e Ambrogio. Un turno pronunciato è rappresentato dalla sua trascrizione; il mezzo usato per comunicare non crea una specie diversa di conversazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
---

### Famiglia

Insieme dei membri che usano una stessa installazione domestica di Ambrogio. Nella prima versione condividono un'unica identità denominata «famiglia».

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Installazione](#installazione)
---

### Indicazione di replica attesa

Segnale booleano fornito dal backend con l'esito di ogni turno completato che stabilisce se la risposta attende una replica della famiglia; un satellite vocale lo usa per ammettere un altro turno nella stessa interazione vocale senza wake word.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Risposta parlata](#risposta-parlata)
  * related: [Esito del turno](#esito-del-turno)
---

### Installazione

Installazione domestica di Ambrogio nell'homelab di una famiglia, con la configurazione, i dati e i processi scelti da chi la gestisce. Chi installa è la persona che configura, avvia e mantiene l'installazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
---

### Interazione vocale

Sequenza di turni vocali consecutivi su un satellite vocale, dall'attivazione con la wake word al ritorno in attesa della wake word, nella quale la famiglia replica senza ripetere la wake word. È uno stato del satellite e non coincide con la sessione conversazionale, che resta aperta fra un'interazione e l'altra.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Satellite vocale](#satellite-vocale)
  * related: [Sessione conversazionale](#sessione-conversazionale)
---

### Risposta parlata

Audio prodotto per comunicare alla famiglia l'esito di un turno quando il client chiede la risposta in voce; sul satellite vocale termina quando la riproduzione è conclusa.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Turno vocale](#turno-vocale)
---

### Satellite vocale

Client conversazionale vocale eseguito su un dispositivo Linux che acquisisce e riproduce audio, riconosce localmente una wake word e comunica con il backend.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * broader: [Client conversazionale](#client-conversazionale)
---

### Scambio

Unità della storia di una conversazione composta da un turno della famiglia e dall'esito comunicato da Ambrogio: una risposta oppure un messaggio di errore.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Conversazione](#conversazione)
---

### Sessione conversazionale

Connessione del protocollo conversazionale `ambrogio.v1` fra un client conversazionale e il backend, sulla quale il client invia i turni e riceve trasmissioni ed esiti. Una sessione non coincide con una conversazione: sulla stessa sessione il client continua conversazioni esistenti o ne inizia di nuove.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Backend](#backend)
  * related: [Client conversazionale](#client-conversazionale)
---

### Turno

Singola richiesta formulata dalla famiglia in una conversazione. È rappresentata come testo, scritto direttamente o ottenuto dalla trascrizione della voce.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Scambio](#scambio)
---

### Turno vocale

Turno pronunciato dalla famiglia e inviato al backend come audio, che il backend trascrive e conserva come testo nella conversazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * broader: [Turno](#turno)
  * related: [Interazione vocale](#interazione-vocale)
---

### Ammissione del turno

Accettazione da parte del backend della richiesta di un turno, dopo la sua chiusura, con cui il turno entra in una conversazione e riceve la propria identità. Un turno ammesso arriva sempre a un esito conservato nella conversazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Turno](#turno)
---

### Esito del turno

Conclusione di un turno comunicata dal backend al client conversazionale: completato con una risposta, fallito con un messaggio pubblico di errore, interrotto dall'arresto del backend oppure rifiutato prima dell'ammissione. L'esito di un turno ammesso è conservato nella conversazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Turno](#turno)
  * related: [Scambio](#scambio)
---

### Rifiuto del turno

Esito di una richiesta che il backend non ammette come turno, comunicato al client conversazionale con un motivo e un messaggio pubblico. Il turno rifiutato non è conservato e non crea una conversazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * broader: [Esito del turno](#esito-del-turno)
  * related: [Ammissione del turno](#ammissione-del-turno)
  * related: [Messaggio pubblico](#messaggio-pubblico)
---

### Messaggio pubblico

Testo destinato alla famiglia che comunica il rifiuto di un turno o l'errore di un turno ammesso, nella lingua configurata e senza dettagli tecnici. Il client conversazionale lo presenta alla famiglia; per un turno ammesso è conservato come esito di errore.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Esito del turno](#esito-del-turno)
---
