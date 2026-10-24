# Elements

### Convenzione dei nomi di casi d'uso e adapter

I casi d'uso e gli adapter usano suffissi di ruolo, mantenendo nel nome la funzione concreta del componente.

Un file che realizza un caso d'uso Application si chiama `<azione>.use-case.ts`, con un nome che descrive l'operazione offerta. Il criterio vale anche per casi d'uso che non espongono rifiuti previsti.

Un file che realizza un adapter si chiama `<funzione-o-integrazione>.adapter.ts`. Sono adapter di ingresso i componenti che traducono eventi o richieste esterne in invocazioni di Application; sono adapter di uscita i componenti che realizzano una porta Application tramite una tecnologia concreta. La realizzazione è indifferentemente una classe, una funzione o un oggetto fornito dalla composition root: non dipende dalla presenza della parola TypeScript `implements`.

La collocazione in `adapters/` non rende automaticamente adapter ogni file contenuto. Mapper, schemi, cataloghi, validatori, driver di libreria e funzioni tecniche di supporto mantengono nomi descrittivi senza aggiungere `.adapter`, salvo che realizzino essi stessi un ingresso o una porta Application. Un coordinatore con stato non riceve o evita `.use-case` per il solo fatto di essere una classe: occorre identificarne la responsabilità e stabilire se offre un caso d'uso oppure supporta altri casi d'uso. In caso di ruolo ambiguo, l'esito della classificazione si documenta nell'ispezione prima di rinominare.

La regola riguarda i nomi dei file di produzione. Non impone il suffisso `Adapter` o `UseCase` a ogni simbolo TypeScript, non introduce un suffisso obbligatorio per le porte e non modifica le regole sui confini dei layer.

Motivazione: Martin Fowler sostiene una politica coerente dei nomi dei ruoli e l'uso dei nomi dei pattern quando chiariscono la responsabilità, senza proporre una convenzione universale: https://martinfowler.com/articles/refactoring-external-service.html . Robert C. Martin evidenzia la riconoscibilità dei casi d'uso nella struttura: https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html . Gli esempi di Alistair Cockburn non impongono il termine Adapter nei nomi: https://alistair.cockburn.us/hexagonal-architecture . Il suffisso obbligatorio è una scelta di Ambrogio, non una prescrizione attribuita a questi autori.

#### Metadata
  * type: specification

#### Relations
  * define: [Nomi dei file secondo il ruolo architetturale](../Requirements/CodeArchitecture.md#nomi-dei-file-secondo-il-ruolo-architetturale)
---
