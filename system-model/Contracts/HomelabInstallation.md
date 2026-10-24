# Elements

### Ciclo di vita dei processi di servizio con Node.js

Realizzazione con Node.js, comune al backend e al satellite.

Costruzione e attivazione. La funzione di costruzione di un ingresso acquisisce le risorse, registra la chiusura di ciascuna in una pila di chiusure della composition root subito dopo averla acquisita e restituisce le capacità dell'ingresso e una funzione `close()`, senza attivarlo. `main.ts` affida a un runner verificabile la sequenza di costruzione, attivazione, attesa della richiesta di arresto e arresto, e riceve dal runner l'esito del processo. Se la costruzione o l'attivazione falliscono, o se l'arresto è richiesto durante l'avvio, l'ingresso non resta attivo e le risorse già acquisite sono chiuse.

Arresto. Il runner installa i gestori di `SIGTERM` e `SIGINT` per tutta la durata del processo; il primo segnale avvia l'unico arresto e i successivi lo condividono senza riavviare il tempo massimo. `close()` ferma prima il nuovo lavoro, poi chiude le risorse della pila in ordine inverso di acquisizione, ciascuna una sola volta, tentando le successive quando una fallisce; il guasto di una chiusura è incapsulato in un `ProjectError` con un messaggio fisso che nomina la risorsa e conserva l'originale come `cause`. Una seconda chiamata di `close()` restituisce lo stesso arresto. Un arresto richiesto e riuscito termina con codice 0, un arresto fallito o scaduto con codice 1.

Esito. Un solo guasto conserva la propria identità; più guasti indipendenti sono raccolti, nell'ordine in cui sono osservati, in un `LifecycleError` con il campo `faults`; un guasto dell'avvio seguito da guasti della pulizia produce un `LifecycleError` con il guasto dell'avvio al primo posto. Un guasto di chiusura dopo un lavoro riuscito rende fallito l'arresto.

Tempo massimo. All'inizio dell'arresto il runner arma un timer che non trattiene il processo; alla scadenza restituisce un esito scaduto con i guasti già osservati, senza attendere le chiusure pendenti, e soltanto `main.ts` chiama `process.exit(1)` dopo il log diagnostico della scadenza.

Percorso fatale. `main.ts` installa, prima di caricare il codice dell'applicazione con import dinamici, gestori di `uncaughtException` e di `unhandledRejection` che scrivono in modo sincrono sul descrittore di `stderr`, mai su `stdout`, un messaggio fisso del processo senza leggere il valore sollevato e chiamano `process.exit(1)` anche se la scrittura fallisce. Il gestore di `unhandledRejection` è l'equivalente di `--unhandled-rejections=strict`: vale per ogni comando di avvio, compresi l'immagine container e l'eseguibile del satellite, che non passano opzioni a Node.js, e nessun altro ascoltatore cattura i rifiuti non gestiti. Domain, Application, adapter, composition root e runner non chiamano `process.exit`.

#### Metadata
  * type: specification

#### Relations
  * define: [Arresto unico, ordinato e limitato nel tempo](../Requirements/HomelabInstallation.md#arresto-unico-ordinato-e-limitato-nel-tempo)
---

### Profilo dell'ambiente di esecuzione e del file d'ambiente locale

Ogni processo di servizio legge l'ambiente di esecuzione dalla variabile `AMBROGIO_ENV`, obbligatoria in ogni ambiente, con i valori `development`, `test` o `production`; una variabile assente, vuota o con un altro valore impedisce l'avvio. In ogni modulo di configurazione una variabile vuota equivale a una variabile assente. Un valore predefinito è dichiarato dal modulo di configurazione per tutti gli ambienti oppure per il solo `development`; in `test` e `production` le impostazioni con un valore predefinito di sviluppo sono obbligatorie.

Il file d'ambiente locale di sviluppo si chiama `.env`, risiede nella radice del repository, è escluso da Git e dall'immagine container ed è caricato soltanto dal comando di sviluppo con l'opzione `--env-file=.env` di Node.js, per cui una variabile già presente nell'ambiente del processo prevale su quella del file. Il codice dell'applicazione non legge file d'ambiente e non usa librerie che li caricano. Il repository fornisce `.env.example`, che elenca ogni variabile letta dai moduli di configurazione con valore vuoto, salvo `AMBROGIO_ENV=development`, e non contiene valori predefiniti né credenziali.

I messaggi d'errore della configurazione nominano soltanto la variabile o il campo interessato e la condizione violata, senza riportarne il valore.

#### Metadata
  * type: specification

#### Relations
  * define: [Ambiente di esecuzione dichiarato](../Requirements/HomelabInstallation.md#ambiente-di-esecuzione-dichiarato)
---
