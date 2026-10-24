# Elements

### Configurazioni effettive escluse dagli artefatti

Ogni repository di Ambrogio deve tenere fuori dal repository Git e dagli artefatti distribuiti, come le immagini container, i file di configurazione effettivi delle installazioni, e i suoi esempi di configurazione non devono contenere credenziali effettive.

#### Details
I repository che leggono configurazioni effettive raffinano questo requisito con i propri file di esclusione e le proprie prove.

Origine: baseline Reqvire «Actual configuration files kept out of artifacts», adottata; «Configuration examples without credentials», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---

### Pubblicazione delle immagini di release

Quando viene creato un tag di release `vMAJOR.MINOR.PATCH` in un repository di Ambrogio che distribuisce un'immagine container, il repository deve pubblicare su GHCR l'immagine con tag uguale al tag Git e alla versione dichiarata dal componente, senza un tag mobile `latest`, soltanto dopo che la CI, la scansione dei segreti e la verifica dell'immagine per ogni architettura dichiarata sono riuscite sullo stesso commit, e deve scrivere il riferimento dell'immagine pubblicata nel riepilogo del job di pubblicazione; un push sul branch principale non deve pubblicare immagini.

#### Details
Ogni repository che distribuisce un'immagine raffina questo requisito con il nome del pacchetto, le architetture e la verifica dell'immagine. La visibilità dei pacchetti segue «Visibilità dei repository decisa dalla persona».

Origine: baseline Reqvire «Release image publication on version tags», adottata; «Release image tag matching the release version», adottata; «Release image verification before push», adottata; «Release publication gated on passing checks», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---

### Validazione della configurazione prima delle risorse

Un processo di Ambrogio deve validare la configurazione dei componenti attivi prima di costruire le risorse che la usano e, se la configurazione non è valida, deve impedire l'avvio operativo con un errore sicuro; la composition root deve fornire a ciascun componente soltanto i valori validati che gli servono, senza letture dirette di file o variabili d'ambiente da Domain e Application.

#### Details
Origine: baseline Reqvire «Validation of active configuration before use», adottata; «Targeted distribution of validated configuration», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---
