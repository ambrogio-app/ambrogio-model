# Elements

### Anteprima delle conversazioni nell'elenco dei client testuali

Quando un client testuale mostra una pagina dell'elenco delle conversazioni conservate, deve presentare per ogni conversazione visibile un'anteprima del primo messaggio della persona ottenuta dallo storico HTTP pubblico e, quando lo storico di una conversazione non è disponibile, deve mantenere selezionabile la conversazione mostrando un identificativo abbreviato.

#### Details
I client testuali sono il client terminale e la chat web; ciascuno raffina il requisito con la lunghezza dell'anteprima, la forma dell'identificativo abbreviato e le Contract References ai contratti HTTP del backend.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---

### Invio del turno testuale sul canale conversazionale

Quando la famiglia invia un turno da un client testuale, il client deve trasmetterlo al backend come richiesta testuale del protocollo conversazionale `ambrogio.v1`, chiedendo la risposta in testo e indicando la conversazione corrente quando la continua.

#### Details
Ogni client raffina il requisito con la propria gestione della sessione conversazionale e le Contract References ai contratti del protocollo del backend.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)
  * [Sessione conversazionale](../Thesaurus/Lessico.md#sessione-conversazionale)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---

### Nuova chat iniziale nei client testuali

All'apertura dell'interfaccia, un client testuale deve aprire una nuova chat locale come conversazione corrente, senza creare una conversazione sul backend, e mostrarla come prima voce dell'elenco delle conversazioni; dopo l'invio del primo messaggio deve usare l'anteprima di quel messaggio come nome della voce e continuare a mostrare la stessa chat.

#### Details
L'apertura dell'interfaccia è l'avvio del processo nel client terminale e l'apertura della pagina nella chat web.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---

### Rifiuto locale del turno testuale non trasmissibile

Quando la persona invia da un client testuale un testo vuoto o composto di soli spazi, il client deve rifiutarlo con un messaggio, senza trasmetterlo al backend.

#### Details
Un client che applica limiti locali ulteriori, come una dimensione massima del testo, li registra nel proprio requisito figlio.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---

### Ripartenza dell'elenco conversazioni dei client testuali dopo un aggiornamento

Quando un client testuale aggiorna l'elenco delle conversazioni conservate, deve scartare il riferimento alla pagina successiva della consultazione precedente e richiedere la prima pagina dell'elenco corrente.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---

### Segnalazione locale dell'interruzione nei client testuali

Quando la sessione conversazionale si chiude prima dell'esito di un turno, oppure il backend comunica `turn.interrupted`, un client testuale deve mostrare lo stato locale di risposta interrotta, senza trasformare l'interruzione in uno scambio di errore conservato.

#### Details
Ogni client raffina il requisito con il testo mostrato nelle proprie lingue e le Contract References ai contratti del protocollo del backend.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)
  * [Sessione conversazionale](../Thesaurus/Lessico.md#sessione-conversazionale)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---

### Stato del turno in elaborazione alla riapertura nei client testuali

Quando lo storico di una conversazione consultata da un client testuale contiene un turno accettato il cui esito non è ancora conservato, il client deve mostrare il testo del turno con l'indicazione del turno in elaborazione, distinta dagli scambi conclusi, e invitare la persona ad aggiornare manualmente la consultazione; a una nuova consultazione in cui lo storico riporta l'esito conservato, deve mostrare lo scambio concluso al posto di quell'indicazione.

#### Details
Ogni client raffina il requisito con le Contract References ai contratti del backend che definiscono lo storico e gli stati persistenti dei turni.

#### Concept References
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)
  * [Conversazione](../Thesaurus/Lessico.md#conversazione)
  * [Turno](../Thesaurus/Lessico.md#turno)
  * [Scambio](../Thesaurus/Lessico.md#scambio)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione familiare](../Capabilities/Product.md#conversazione-familiare)
---
