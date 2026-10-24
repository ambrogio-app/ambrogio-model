# Elements

### Architettura del codice

Il codice di produzione dei componenti di Ambrogio segue regole comuni sulla struttura in layer, sui confini degli import, sulla rappresentazione degli esiti previsti e dei guasti inattesi, sulla diagnostica tramite log e sull'uso delle sole interfacce pubbliche fra backend e client, così che ogni componente resti comprensibile e verificabile allo stesso modo e i suoi dettagli tecnici restino sostituibili.

#### Concept References
  * [Backend](../Thesaurus/Lessico.md#backend)
  * [Client conversazionale](../Thesaurus/Lessico.md#client-conversazionale)

#### Metadata
  * type: capability
---

### Installazione nell'homelab

Chi installa Ambrogio nel proprio homelab ottiene per ogni release immagini container pubblicate e verificate, configura i componenti senza modificarne il codice, tiene configurazioni effettive, credenziali e dati fuori dagli artefatti distribuiti, e avvia e arresta i processi in modo prevedibile.

#### Concept References
  * [Installazione](../Thesaurus/Lessico.md#installazione)

#### Metadata
  * type: capability
---

### Sviluppo governato dal modello

Chi sviluppa Ambrogio, persona o agente, lavora a partire da un solo modello Reqvire distribuito sui repository del prodotto: capability, requisiti, contratti e verifiche sono registrati e concordati prima del codice, la CI e le regole di integrazione controllano l'intero modello e ogni repository, e la scansione dei segreti protegge la storia di ogni repository. Le decisioni comuni a più repository sono registrate una sola volta in `ambrogio-model` e raffinate nei repository che le realizzano.

#### Metadata
  * type: capability
---
