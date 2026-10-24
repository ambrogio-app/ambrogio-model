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

Agente specializzato di Ambrogio configurato con un modello linguistico e un collegamento client a un server MCP. Usa i tool di quel server per svolgere compiti affidati dall'orchestratore durante la conversazione. Memory e Home Assistant sono i connettori di base della prima versione.

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

Segnale booleano fornito dal backend con l'esito di un turno vocale che stabilisce se, dopo la risposta, la famiglia formula un altro turno nella stessa interazione vocale senza wake word.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Risposta parlata](#risposta-parlata)
---

### Installazione

Installazione domestica di Ambrogio nell'homelab di una famiglia, con la configurazione, i dati e i processi scelti da chi la gestisce. Chi installa è la persona che configura, avvia e mantiene l'installazione.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
---

### Interazione vocale

Sessione temporanea tra un satellite vocale e il backend che comprende più turni vocali consecutivi della famiglia senza ripetere la wake word.

#### Metadata
  * type: concept

#### Relations
  * derivedFrom: [Lessico Ambrogio](#lessico-ambrogio)
  * related: [Satellite vocale](#satellite-vocale)
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
