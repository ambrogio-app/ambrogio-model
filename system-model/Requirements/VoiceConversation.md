# Elements

### Elaborazione vocale locale con sherpa-onnx

Quando la voce è abilitata nell'installazione, Ambrogio deve eseguire in locale, senza servizi di rete esterni, il riconoscimento della wake word, il rilevamento dell'attività vocale, la trascrizione e la sintesi vocale, usando sherpa-onnx come unico motore vocale del satellite e del backend, e deve permettere di sostituire i modelli vocali con la sola configurazione dell'installazione, fra le famiglie di modelli supportate da ciascun componente.

#### Details
Il satellite raffina il requisito per la wake word e per l'attività vocale, il backend per la trascrizione e la sintesi. Ciascun componente dichiara le famiglie di modelli che supporta; un modello di una famiglia supportata si sostituisce cambiando file e configurazione, mentre una famiglia nuova richiede una modifica del codice che la supporta.

Un solo motore vocale nei due repository riduce le dipendenze native, le immagini e le prove da mantenere. È stata scartata la convivenza di più motori, per esempio Vosk per la trascrizione e openWakeWord per la wake word accanto a sherpa-onnx, perché richiederebbe di mantenere e provare due pile vocali.

#### Concept References
  * [Satellite vocale](../Thesaurus/Lessico.md#satellite-vocale)
  * [Turno vocale](../Thesaurus/Lessico.md#turno-vocale)
  * [Risposta parlata](../Thesaurus/Lessico.md#risposta-parlata)

#### Metadata
  * type: requirement

#### Relations
  * specify: [Conversazione a voce](../Capabilities/Product.md#conversazione-a-voce)
---
