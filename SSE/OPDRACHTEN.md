# Opdrachten SSE-project

Twee opdrachten om de basisfunctionaliteit van Server-Sent Events (SSE) te leren
aan de hand van dit project. Beide opdrachten raken alleen `server/src/server.ts`
en `client/src/components/LiveClock.vue`.

## Opdracht 1 — Eigen data door de stream sturen

**Doel:** begrijpen hoe je willekeurige data (niet alleen een tijdstip) via SSE
van server naar client stuurt en verwerkt.

- Pas `server/src/server.ts` aan: stuur naast `time` ook een willekeurig getal
  mee, bv. een "temperatuur" tussen 15 en 30 graden (`Math.random()`).
- Pas `LiveClock.vue` aan zodat de temperatuur ook getoond wordt.
- Extra uitdaging: geef de temperatuur een andere kleur als deze boven de 25
  graden komt.

**Slaagcriterium:** de pagina toont elke seconde een nieuwe, wisselende
temperatuur naast de tijd.

## Opdracht 2 — De verbinding zelf besturen

**Doel:** begrijpen dat een SSE-verbinding iets is dat je zelf kunt stoppen.

- Voeg één knop "Stop" toe aan `LiveClock.vue`.
- Bij een klik roep je `eventSource.close()` aan.
- De bestaande statusindicator ("Verbonden via SSE" / "Niet verbonden") moet
  dan automatisch naar "Niet verbonden" springen, en de klok blijft stilstaan
  op de laatste tijd.

**Slaagcriterium:** klikken op "Stop" bevriest de klok en de status verandert
zichtbaar.
