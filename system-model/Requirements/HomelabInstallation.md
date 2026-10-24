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

### Arresto unico, ordinato e limitato nel tempo

Ogni processo di servizio di Ambrogio deve avviare un solo percorso di arresto anche quando riceve richieste di arresto ripetute, deve fermare il nuovo lavoro prima di chiudere le risorse da cui quel lavoro dipende, deve tentare la chiusura di ogni risorsa posseduta esattamente una volta, in ordine inverso di acquisizione, tentando le altre chiusure quando una fallisce, e deve applicare all'arresto un tempo massimo esplicito, misurato dall'inizio della chiusura, comprensivo dell'attesa del lavoro in corso e della pulizia e non riavviato da nuove richieste o per ciascuna risorsa; alla scadenza deve terminare con esito non riuscito conservando i guasti già osservati, senza dichiarare conclusi, annullati o ripetibili effetti dall'esito incerto, e il supervisore del deployment deve concedere almeno quella finestra. La composition root non deve delegare la chiusura delle proprie risorse ai loro consumatori.

#### Details
I processi di servizio sono il backend e il satellite vocale; ciascuno raffina questo requisito con il proprio tempo massimo e con la finestra dichiarata nei propri esempi di deployment. Con Docker la finestra concessa dal supervisore è il periodo di arresto del container: `stop_grace_period` in Docker Compose, `--stop-timeout` di `docker run` o `--time` di `docker stop`, con valore predefinito di 10 secondi; scaduta la finestra Docker termina il processo con `SIGKILL`. Il lavoro in corso all'arresto è interrotto secondo i requisiti del repository, non atteso fino al completamento.

Origine: baseline Reqvire «Single ordered shutdown», adottata; «Bounded shutdown window», adottata.

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

### Diagnostica del mancato avvio

Se la preparazione o l'attivazione di un processo di servizio di Ambrogio falliscono prima che il processo sia operativo, il processo deve emettere un solo log diagnostico definitivo che identifica la causa del mancato avvio senza riprodurre valori segreti, segnalare il mancato avvio su stderr e terminare con un codice di uscita non riuscito.

#### Details
Il backend è operativo quando è in ascolto, il satellite quando attende la wake word. Ogni repository raffina questo requisito con l'evento, la riga su stderr e i messaggi fissi che nominano la fase fallita; la causa è resa identificabile da un errore del progetto con un messaggio fisso della fase, secondo «Serializzazione controllata di err». Un rifiuto della configurazione che un repository tratta come esito previsto, con un evento e un codice di uscita propri, resta regolato dai requisiti di quel repository.

Origine: baseline Reqvire «Startup failure diagnostics», adottata.

#### Metadata
  * type: requirement

#### Relations
  * specify: [Installazione nell'homelab](../Capabilities/Engineering.md#installazione-nellhomelab)
---

### Esito del ciclo di vita conservato nei guasti

Quando l'avvio, il lavoro o la pulizia di un processo di servizio di Ambrogio falliscono, il processo deve conservare l'esito già determinato, senza riscrivere una risposta già inviata né promettere di annullarne gli effetti, deve dichiarare fallito il ciclo di vita quando il lavoro è riuscito ma la pulizia è fallita, e deve mantenere distinti, per identità e nell'ordine in cui sono osservati, i guasti indipendenti, senza presentarli come cause l'uno dell'altro.

#### Details
Gli esiti previsti e gli errori d'uso restano fuori dalla raccolta dei guasti tecnici; per un guasto è emesso al massimo un log diagnostico definitivo, secondo «Diagnosi definitiva unica dei guasti inattesi».

Origine: baseline Reqvire «Lifecycle outcome preserved across failures», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Ciclo di vita dei processi di servizio con Node.js](../Contracts/HomelabInstallation.md#ciclo-di-vita-dei-processi-di-servizio-con-nodejs)

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

### Percorso fatale separato

Gli errori che sfuggono a ogni confine controllato di un processo di servizio di Ambrogio devono seguire un percorso fatale distinto dai guasti catturati, nel quale il confine di processo tenta di scrivere su stderr un messaggio di emergenza fisso e sicuro, senza ispezionare né serializzare il valore sollevato, e poi termina con esito non riuscito, senza continuare il servizio, avviare casi d'uso, registrare log ordinari, ritentare o eseguire pulizie asincrone e senza promettere il ripristino o la pulizia delle operazioni interrotte; i runner e le composition root non devono inviare al percorso fatale i guasti catturati.

#### Details
Origine: baseline Reqvire «Separate fatal path», adottata.

#### Metadata
  * type: requirement

#### Contract References
  * [Ciclo di vita dei processi di servizio con Node.js](../Contracts/HomelabInstallation.md#ciclo-di-vita-dei-processi-di-servizio-con-nodejs)

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
