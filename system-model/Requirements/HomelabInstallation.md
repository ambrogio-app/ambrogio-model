# Elements

### Ambiente di esecuzione dichiarato

Ogni processo di servizio di Ambrogio deve richiedere un ambiente di esecuzione esplicito fra `development`, `test` e `production`, senza valore predefinito, deve applicare un valore predefinito dichiarato per un ambiente soltanto in quell'ambiente e, in `production`, deve richiedere un valore esplicito per ogni impostazione che ha un valore predefinito di sviluppo.

#### Details
I repository raffinano questo requisito con le variabili dei propri moduli di configurazione.

Origine: baseline Reqvire «Declared runtime environment», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---

### Caricamento esplicito del file d'ambiente locale

Quando lo sviluppo di un processo di servizio di Ambrogio usa un file d'ambiente locale, il comando di sviluppo deve caricarlo esplicitamente, i valori già presenti nell'ambiente del processo devono prevalere su quelli del file, l'applicazione non deve caricare file d'ambiente da sé, e il repository deve fornire un file d'esempio con i nomi delle variabili e i soli valori approvati; il file d'ambiente effettivo non deve essere versionato.

#### Details
Origine: baseline Reqvire «Explicit loading of local environment files», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Profilo dell'ambiente di esecuzione e del file d'ambiente locale](../Contracts/HomelabInstallation.md#profilo-dellambiente-di-esecuzione-e-del-file-dambiente-locale)

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---

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

### Modulo di configurazione per componente dalle variabili d'ambiente

Ogni componente configurabile di un processo di servizio di Ambrogio deve avere un proprio modulo di configurazione TypeScript, parte della build, che legge i valori dalle variabili d'ambiente del processo e li valida con lo schema del componente; il modulo non deve contenere valori effettivi, chi installa deve fornire i valori come variabili d'ambiente senza eseguire codice proprio, e il processo deve leggere la configurazione una sola volta all'avvio, prima di attivare i componenti dell'ingresso che avvia.

#### Details
I processi di servizio sono il backend e il satellite vocale; la chat web è un insieme di file statici con la propria configurazione e il client terminale riceve le impostazioni da chi lo avvia. Le credenziali di API esterne sono valori di configurazione come gli altri. I repository raffinano questo requisito con i propri moduli e le proprie variabili; un file di soli dati montato nel container al posto delle variabili è ammesso soltanto dove un requisito del repository lo dichiara come adattamento.

Origine: baseline Reqvire «Configuration module per component reading environment variables», adottata; «One-time configuration load at startup», adottata.

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

### Valori predefiniti applicati dal proprietario

Un valore predefinito deve essere applicato soltanto quando l'assenza del valore è ammessa e il valore è deciso per quel concetto, una sola volta ed esplicitamente dal suo proprietario: il modulo di configurazione del componente per i valori tecnici e d'ambiente, l'adapter inbound per la comodità del protocollo, Application per l'intenzione e Domain per una creazione valida; gli esempi distribuiti, i file d'ambiente d'esempio e i file Compose d'esempio non devono ripetere un valore predefinito, e un valore predefinito dichiarato soltanto nella documentazione o in un esempio non deve essere considerato applicato.

#### Details
La documentazione utente descrive i valori predefiniti applicati dai proprietari senza sostituirli.

Origine: baseline Reqvire «Defaults applied by their owner», adattata: la regola si estende ai valori predefiniti della configurazione, di cui il modulo di configurazione del componente è il proprietario, e vieta agli esempi distribuiti di ripeterli.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---
