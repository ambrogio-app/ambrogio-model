# Elements

### Stati del turno testuale alla riapertura

Un turno testuale accettato, quando un client testuale consulta la conversazione che lo contiene, è mostrato in uno di questi stati:

- in elaborazione, finché lo storico non ne riporta l'esito: il testo del turno è distinto dagli scambi conclusi e accompagnato dall'invito ad aggiornare manualmente la consultazione;
- concluso con risposta oppure con errore, quando lo storico ne riporta l'esito conservato: il client presenta lo scambio concluso e non presenta più lo stato in elaborazione per lo stesso turno;
- interrotto, quando lo storico riporta il turno come interrotto: il client lo mostra con l'avviso di risposta interrotta.

Il passaggio dallo stato in elaborazione a un altro stato avviene soltanto a una nuova consultazione richiesta dalla persona. La riapertura non riprende le trasmissioni del turno, non recupera i frammenti parziali e non aggiorna automaticamente lo stato mostrato.

#### Metadata
  * type: state

#### Relations
  * define: [Stato del turno in elaborazione alla riapertura nei client testuali](../Requirements/TextConversation.md#stato-del-turno-in-elaborazione-alla-riapertura-nei-client-testuali)
---
