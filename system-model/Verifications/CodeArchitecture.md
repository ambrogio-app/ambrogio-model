# Elements

### Verifica dell'architettura del codice

Raggruppa le verifiche comuni della strategia di test dei repository di prodotto.

#### Metadata
  * type: verification-objective
---

### Analisi della strategia di test

Esaminare in ogni repository di prodotto un campione dei test Domain, dei casi d'uso, degli adapter e dei trasporti, con i loro fake, fixture e builder, e la configurazione dei test e della CI, confrontandoli con i requisiti comuni sulla strategia di test.

#### Details
L'analisi passa se i test del nucleo usano gli ingressi pubblici con fake definiti nel test e valori deterministici, senza sostituire moduli; se i test degli adapter usano la tecnologia reale con oracoli indipendenti, salvo le tecnologie che i requisiti affidano a dimostrazioni o all'ingresso di prova del backend; se i test dei trasporti usano il framework reale; se fixture e fake sono locali e deterministici e non esiste un package condiviso di utilità dei test; e se nessun repository dichiara una soglia di copertura come criterio di sufficienza. Fallisce se una di queste condizioni manca.

Non automatizzabile: stabilire se un fake, un oracolo o una fixture ha davvero queste proprietà richiede di leggere i test rispetto al comportamento che dichiarano di provare.

#### Metadata
  * type: analysis-verification

#### Relations
  * derivedFrom: [Verifica dell'architettura del codice](#verifica-dellarchitettura-del-codice)
  * verify: [Adapter e trasporti provati sulla tecnologia reale](../Requirements/CodeArchitecture.md#adapter-e-trasporti-provati-sulla-tecnologia-reale)
  * verify: [Nucleo provato dagli ingressi pubblici con fixture locali](../Requirements/CodeArchitecture.md#nucleo-provato-dagli-ingressi-pubblici-con-fixture-locali)
  * verify: [Sufficienza dei test giudicata dai comportamenti](../Requirements/CodeArchitecture.md#sufficienza-dei-test-giudicata-dai-comportamenti)
---
