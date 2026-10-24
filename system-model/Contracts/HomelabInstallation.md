# Elements

### Profilo dell'ambiente di esecuzione e del file d'ambiente locale

Ogni processo di servizio legge l'ambiente di esecuzione dalla variabile `AMBROGIO_ENV`, obbligatoria in ogni ambiente, con i valori `development`, `test` o `production`; una variabile assente, vuota o con un altro valore impedisce l'avvio. In ogni modulo di configurazione una variabile vuota equivale a una variabile assente. Un valore predefinito è dichiarato dal modulo di configurazione per tutti gli ambienti oppure per il solo `development`; in `test` e `production` le impostazioni con un valore predefinito di sviluppo sono obbligatorie.

Il file d'ambiente locale di sviluppo si chiama `.env`, risiede nella radice del repository, è escluso da Git e dall'immagine container ed è caricato soltanto dal comando di sviluppo con l'opzione `--env-file=.env` di Node.js, per cui una variabile già presente nell'ambiente del processo prevale su quella del file. Il codice dell'applicazione non legge file d'ambiente e non usa librerie che li caricano. Il repository fornisce `.env.example`, che elenca ogni variabile letta dai moduli di configurazione con valore vuoto, salvo `AMBROGIO_ENV=development`, e non contiene valori predefiniti né credenziali.

I messaggi d'errore della configurazione nominano soltanto la variabile o il campo interessato e la condizione violata, senza riportarne il valore.

#### Metadata
  * type: specification

#### Relations
  * define: [Ambiente di esecuzione dichiarato](../Requirements/HomelabInstallation.md#ambiente-di-esecuzione-dichiarato)
---
