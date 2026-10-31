# Elements

### Convenzione dei nomi di casi d'uso, porte e adapter

I casi d'uso, le porte e gli adapter usano suffissi di ruolo, mantenendo nel nome la funzione concreta del componente.

Un file che realizza un caso d'uso Application si chiama `<azione>.use-case.ts`, con un nome che descrive l'operazione offerta, anche quando il caso d'uso non espone rifiuti previsti.

Un file che dichiara una porta Application si chiama `<capacità>.port.ts`, con un nome che descrive la capacità richiesta dai casi d'uso, per esempio `conversation-history-read.port.ts`. Una porta risiede nel proprio file `.port.ts`, mai nel file di un caso d'uso; i dati di ingresso e di uscita del caso d'uso, compresi i callback forniti dal chiamante, restano nel file del caso d'uso. Anche un contratto che un adapter inbound richiede all'applicazione che lo assembla, come un servizio tecnico ricevuto dalla composition root, è una porta: il suo file si chiama `<capacità>.port.ts` e la sua realizzazione è un adapter.

Un file che realizza un adapter si chiama `<funzione-o-integrazione>.adapter.ts`. Ogni adapter ha una porta: un adapter outbound realizza una porta `.port.ts` tramite una tecnologia concreta, un adapter inbound traduce eventi o richieste esterne nell'invocazione di un caso d'uso `.use-case.ts`. La realizzazione è indifferentemente una classe, una funzione o un oggetto e non dipende dalla parola TypeScript `implements`. La realizzazione di una porta non è mai scritta nella composition root, nemmeno come oggetto letterale: risiede nel proprio file `.adapter.ts` e la composition root la istanzia.

Un file che non realizza una porta né invoca un caso d'uso non è un adapter, anche se risiede in `adapters/`: mapper, schemi, cataloghi, validatori, driver di libreria, funzioni tecniche di supporto e aggregatori che si limitano a registrare gli adapter inbound di un package hanno nomi descrittivi senza `.adapter`. Un coordinatore con stato è un caso d'uso soltanto se offre un'operazione di Application, non per il solo fatto di essere una classe; l'ispezione dei nomi registra la classificazione dei ruoli ambigui.

La regola riguarda i nomi dei file di produzione: non impone i suffissi `Adapter`, `Port` o `UseCase` ai simboli TypeScript e non modifica le regole sui confini dei layer.

#### Metadata
  * type: specification

#### Relations
  * define: [Nomi dei file secondo il ruolo architetturale](../Requirements/CodeArchitecture.md#nomi-dei-file-secondo-il-ruolo-architetturale)
---

### Profilo controllato di serializzazione di err

La rappresentazione JSON di `err` è una vista composta soltanto da campi ammessi esplicitamente dal serializzatore registrato in `serializers.err` della configurazione Pino del logger di base. Gli errori costruiti dal progetto usano una sottoclasse `Error` dedicata del componente, `ProjectError`, riconosciuta dal serializzatore: la loro vista contiene `type`, `message` e `stack`. La sottoclasse di `ProjectError` che raccoglie guasti indipendenti del ciclo di vita, `LifecycleError`, aggiunge `faults`, l'elenco ordinato delle viste dei guasti raccolti secondo questo stesso profilo.

Gli errori ricevuti da driver, SDK, provider o librerie conservano in memoria il tipo originale e, come ogni valore lanciato sconosciuto, ricevono la vista costante `{ "type": "Error", "message": <descrizione costante del componente>, "stack": "[redacted]" }`, indipendente dal valore ricevuto, senza copiarne messaggio, stack o proprietà aggiuntive. Un `AggregateError` non costruito dal progetto riceve la vista `{ "type": "AggregateError", "message": <descrizione costante del componente>, "stack": "[redacted]", "errors": [...] }`, dove `errors` contiene, nell'ordine, la vista secondo questo stesso profilo di ciascuno dei suoi errori, così che la causa di ogni guasto raccolto resta riconoscibile. La catena `cause` non è serializzata.

La stessa vista vale per ogni `Error` presente nei campi di un evento e nei campi fissi di un logger derivato, a qualunque profondità e sotto qualunque chiave, non soltanto per quello nel campo `err`: la formattazione dei campi del logger di base sostituisce ogni istanza di `Error` con la sua vista. Il serializzatore e la formattazione restituiscono nuovi oggetti e non modificano gli `Error` ricevuti né gli oggetti della loro catena `cause`.

La normalizzazione diagnostica al confine conserva l'identità di ogni `Error` ricevuto e rappresenta un valore non `Error` con un nuovo `Error` privo del tipo del progetto; il tipo del progetto non è mai applicato a un guasto esterno o sconosciuto. I messaggi degli errori del progetto non contengono valori letti dall'ambiente o da file, URL, credenziali, token o chiavi: nominano la fase, la risorsa, la variabile o l'identificativo configurato interessati.

#### Metadata
  * type: input-output

#### Relations
  * define: [Serializzazione controllata di err](../Requirements/CodeArchitecture.md#serializzazione-controllata-di-err)
---

### Profilo del logger con Pino

L'interfaccia minima del logger è un tipo TypeScript strutturale dichiarato dal codice di Ambrogio: i metodi `debug`, `info`, `warn` ed `error` ricevono un oggetto di campi selezionati e, facoltativamente, un messaggio breve controllato dal codice; il metodo `child` riceve campi fissi e restituisce un nuovo logger con la stessa interfaccia. I componenti che la ricevono non importano tipi o valori di Pino né il logger di un framework che incorpora Pino.

L'entrypoint di ogni processo crea con Pino il logger di base una sola volta e la composition root lo passa ai componenti che ne hanno bisogno, oppure passa loro un logger derivato con il contesto di una richiesta o di una sessione; nessun modulo crea un proprio logger Pino o importa un'istanza globale. Il logger fornisce timestamp e livello e omette i campi assenti. La configurazione Pino imposta `errorKey` su una chiave che nessun evento usa: altrimenti, per un evento con `err` e senza messaggio, Pino copierebbe in `msg` il messaggio dell'errore, aggirando la vista controllata di `err`, che resta applicata dal serializzatore del campo `err`.

La configurazione Pino del logger di base sostituisce con `[redacted]` il valore di ogni campo il cui nome contiene, senza distinguere maiuscole e minuscole, `token`, `password`, `passwd`, `secret`, `authorization`, `cookie`, `credential`, `apikey`, `api_key` o `api-key`, a ogni profondità dei campi di un evento e dei campi fissi di un logger derivato: negli oggetti semplici, negli array, nei campi propri enumerabili delle istanze di classi e negli oggetti referenziati più volte o in modo circolare, oscurati in ogni occorrenza senza interrompere la scrittura della riga. L'oscuramento lavora su copie e non modifica gli oggetti originali; le istanze di `Error` non sono attraversate e ricevono la vista del profilo controllato di serializzazione di `err`. Lo schema comprende i nomi delle variabili d'ambiente delle credenziali, come `MISTRAL_API_KEY`. L'oscuramento è una protezione aggiuntiva dopo la selezione esplicita dei campi e non la sostituisce.

#### Metadata
  * type: specification

#### Relations
  * define: [Interfaccia minima del logger con un solo logger di base](../Requirements/CodeArchitecture.md#interfaccia-minima-del-logger-con-un-solo-logger-di-base)
---

### Suite di test con Vitest

Ogni file di test TypeScript termina con `.spec.ts` e risiede nella cartella `src/` del file sorgente che verifica, accanto a quel file. Il nome del test è il nome del file verificato senza l'estensione `.ts`, seguito, quando più file di test verificano lo stesso file, da un aspetto separato da un punto e infine da `.spec.ts`: per esempio `exchange-turn.use-case.spec.ts` verifica `exchange-turn.use-case.ts` e `conversation-server.session-lifecycle.spec.ts` verifica `conversation-server.ts`. Un file di test verifica un solo file sorgente, attraverso le sue interfacce; le prove di più file sorgenti si dividono in un file di test per ciascuno.

I file che usano un database PostgreSQL reale, perché esercitano un adapter di persistenza o attraversano l'archivio di un'applicazione, terminano con `.integration.spec.ts`; i file che avviano artefatti compilati in un processo figlio terminano con `.e2e.spec.ts`. Nessun nome di file di test porta un qualificatore di layer, come `domain`, `application`, `inbound`, `outbound` o `unit`; il suffisso di ruolo del file verificato, come `.use-case` o `.adapter`, fa parte del nome di quel file e resta nel nome del test.

I test che non verificano un solo file sorgente risiedono fuori da `src/`, in cartelle `test/` dedicate:

- `test/support/` di ciascuna unità con test contiene i moduli di supporto condivisi dai suoi test, come fixture, fake e client di protocollo, e nessun file `.spec.ts`; `test/support/` nella radice del repository contiene allo stesso modo i moduli di supporto condivisi dai test di più unità;
- `test/<artefatto>/` di un'unità contiene i test di un artefatto del repository che non è codice TypeScript dell'unità e che l'unità usa, come lo schema pubblicato di un protocollo o le configurazioni d'esempio;
- `test/repository/` nella radice del repository contiene i test dell'intero repository, come le regole di architettura con le loro fixture negative, i workflow, l'hook pre-commit e le proprietà comuni a più unità, con i loro moduli di supporto.

Vitest è l'unico runner. `vitest.config.ts` nella radice del repository dichiara i progetti `fast`, con ogni file `*.spec.ts` che non è di integrazione né dei processi compilati, `integration`, con i file `*.integration.spec.ts`, ed `e2e`, con i file `*.e2e.spec.ts`; i tre insiemi sono disgiunti, così che nessun file giri due volte, e ne restano esclusi `node_modules/` e `dist/`. Gli script `test`, `test:integration` e `test:e2e` del `package.json` della radice eseguono ciascuno un progetto con `vitest run --project <nome>`; un repository dichiara soltanto gli script dei progetti che contengono file, e la CI e il comando di verifica completo eseguono ognuno di quegli script. I processi compilati sono avviati con Node.js come processi figli coordinati da Vitest, che ne valuta uscita ed esito.

Il controllo TypeScript del repository comprende i file `*.spec.ts` e le cartelle `test/`; la build pubblicata e l'immagine li escludono.

#### Metadata
  * type: specification

#### Relations
  * define: [Suite di test con Vitest accanto al codice](../Requirements/CodeArchitecture.md#suite-di-test-con-vitest-accanto-al-codice)
---
