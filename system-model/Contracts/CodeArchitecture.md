# Elements

### Convenzione dei nomi di casi d'uso, porte e adapter

I casi d'uso, le porte e gli adapter usano suffissi di ruolo, mantenendo nel nome la funzione concreta del componente.

Un file che realizza un caso d'uso Application si chiama `<azione>.use-case.ts`, con un nome che descrive l'operazione offerta. Il criterio vale anche per casi d'uso che non espongono rifiuti previsti.

Un file che dichiara una porta Application si chiama `<capacità>.port.ts`, con un nome che descrive la capacità richiesta dai casi d'uso, per esempio `conversation-write.port.ts`. Una porta dichiarata nel file di un caso d'uso va spostata nel proprio file `.port.ts`; i dati di ingresso e di uscita del caso d'uso, compresi i callback forniti dal chiamante, restano nel file del caso d'uso.

Un file che realizza un adapter si chiama `<funzione-o-integrazione>.adapter.ts`. Sono adapter di ingresso i componenti che traducono eventi o richieste esterne in invocazioni di Application; sono adapter di uscita i componenti che realizzano una porta Application tramite una tecnologia concreta. La realizzazione è indifferentemente una classe, una funzione o un oggetto fornito dalla composition root: non dipende dalla presenza della parola TypeScript `implements`.

La collocazione in `adapters/` non rende automaticamente adapter ogni file contenuto. Mapper, schemi, cataloghi, validatori, driver di libreria e funzioni tecniche di supporto mantengono nomi descrittivi senza aggiungere `.adapter`, salvo che realizzino essi stessi un ingresso o una porta Application. Un coordinatore con stato non riceve o evita `.use-case` per il solo fatto di essere una classe: occorre identificarne la responsabilità e stabilire se offre un caso d'uso oppure supporta altri casi d'uso. In caso di ruolo ambiguo, l'esito della classificazione si documenta nell'ispezione prima di rinominare.

La regola riguarda i nomi dei file di produzione. Non impone il suffisso `Adapter`, `Port` o `UseCase` ai simboli TypeScript e non modifica le regole sui confini dei layer.

Motivazione: Martin Fowler sostiene una politica coerente dei nomi dei ruoli e l'uso dei nomi dei pattern quando chiariscono la responsabilità, senza proporre una convenzione universale: https://martinfowler.com/articles/refactoring-external-service.html . Robert C. Martin evidenzia la riconoscibilità dei casi d'uso nella struttura: https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html . Gli esempi di Alistair Cockburn non impongono il termine Adapter nei nomi: https://alistair.cockburn.us/hexagonal-architecture . I suffissi obbligatori sono una scelta di Ambrogio, non una prescrizione attribuita a questi autori.

#### Metadata
  * type: specification

#### Relations
  * define: [Nomi dei file secondo il ruolo architetturale](../Requirements/CodeArchitecture.md#nomi-dei-file-secondo-il-ruolo-architetturale)
---

### Suite di test con Vitest

Ogni file di test TypeScript termina con `.spec.ts` e risiede nella cartella `src/` del file sorgente che verifica, accanto a quel file. Il nome del test è il nome del file verificato senza l'estensione `.ts`, seguito, quando più file di test verificano lo stesso file, da un aspetto separato da un punto e infine da `.spec.ts`: per esempio `exchange-turn.use-case.spec.ts` verifica `exchange-turn.use-case.ts` e `conversation-server.session-lifecycle.spec.ts` verifica `conversation-server.ts`. Un file di test verifica un solo file sorgente, attraverso le sue interfacce; le prove di più file sorgenti si dividono in un file di test per ciascuno.

I file che esercitano un adapter contro un database SQLite reale terminano con `.integration.spec.ts`; i file che avviano artefatti compilati in un processo figlio terminano con `.e2e.spec.ts`. Nessun nome di file di test porta un qualificatore di layer, come `domain`, `application`, `inbound`, `outbound` o `unit`; il suffisso di ruolo del file verificato, come `.use-case` o `.adapter`, fa parte del nome di quel file e resta nel nome del test.

I test che non verificano un solo file sorgente risiedono fuori da `src/`, in cartelle `test/` dedicate:

- `test/support/` di ciascuna unità con test contiene i moduli di supporto condivisi dai suoi test, come fixture, fake e client di protocollo, e nessun file `.spec.ts`;
- `test/<artefatto>/` di un'unità contiene i test di un artefatto del repository che non è codice TypeScript dell'unità e che l'unità usa, come lo schema pubblicato di un protocollo o le configurazioni d'esempio;
- `test/repository/` nella radice del repository contiene i test dell'intero repository, come le regole di architettura con le loro fixture negative, i workflow, l'hook pre-commit e le proprietà comuni a più unità, con i loro moduli di supporto.

Vitest è l'unico runner. `vitest.config.ts` nella radice del repository dichiara i progetti `fast`, con ogni file `*.spec.ts` che non è di integrazione né dei processi compilati, `integration`, con i file `*.integration.spec.ts`, ed `e2e`, con i file `*.e2e.spec.ts`; i tre insiemi sono disgiunti, così che nessun file giri due volte, e ne restano esclusi `node_modules/` e `dist/`. Gli script `test`, `test:integration` e `test:e2e` del `package.json` della radice eseguono ciascuno un progetto con `vitest run --project <nome>`; un repository dichiara soltanto gli script dei progetti che contengono file, e la CI e il comando di verifica completo eseguono ognuno di quegli script. I processi compilati sono avviati con Node.js come processi figli coordinati da Vitest, che ne valuta uscita ed esito.

Il controllo TypeScript del repository comprende i file `*.spec.ts` e le cartelle `test/`; la build pubblicata e l'immagine li escludono.

#### Metadata
  * type: specification

#### Relations
  * define: [Suite di test con Vitest accanto al codice](../Requirements/CodeArchitecture.md#suite-di-test-con-vitest-accanto-al-codice)
---
