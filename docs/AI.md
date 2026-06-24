# AI-strategi (beslut / backlog)

> Status: **beslut taget, ej byggt.** I prototypen är AI endast en ärlig
> placeholder (`digestService`, `generated: false`). Ingen riktig AI ännu.

## Beslut

Produkten fungerar fullt ut **utan AI**. AI är ett tunt, grundat förädlingslager
ovanpå, aldrig fundamentet. Vi använder inte AI för det som måste vara pålitligt.

### Utan AI (deterministiskt / redaktionellt) — kärnan
- **Veckoinnehåll ("Resan"/guide):** redaktionellt och granskat. AI-genererat
  hälso-/beteendeinnehåll är en risk (hallucination, vet-påståenden, ojämn
  kvalitet, ansvar). Det här är en moat, inte något att automatisera bort.
- **Mätning (vikt, mankhöjd, tillväxt):** ren logik och kurvor. Aldrig AI på
  siffror.

### Med AI (smal, lågrisk värdeyta)
- **Personlig veckosammanfattning** (`WeeklyDigest`): generativ text **ovanpå
  användarens egen loggdata**. "Den här veckan loggade du 2 bilder, Atlas gick
  upp 0,4 kg och klarade milstolpen X." Hög emotionell payoff, låg risk.
- (Senare, kanske) en lugn, strikt grundad Q&A-assistent med tydliga gränser.

## Hur baby-apparna gör (referens)
Preglife/BabyJourney bygger på **redaktionellt expertinnehåll** + deterministisk
tracking + påminnelser/känsla. I princip ingen generativ AI i ryggraden. Samma
modell passar PuppyJourney.

## Villkor när vi kopplar på AI
- **Grundad i faktisk loggdata.** Aldrig hitta på siffror eller händelser
  ("vi observerar, vi hittar inte på").
- **Server-side + cachad per vecka** (backend-funktion), inte ett anrop vid varje
  skärmladdning. Billigt och stabilt.
- **Liten, snabb modell räcker** för sammanfattningar (t.ex. Claude Haiku).
- **Inga hälso-/vet-råd** i AI-texten. Bara värme och spegling av deras data.
- Tydlig märkning att det är en sammanfattning, samma ärlighet som övriga ytor.

## Fasning
1. Behåll `digestService` som ärlig placeholder tills det finns loggdata att
   sammanfatta.
2. När tracking-data finns: backend-funktion som genererar veckosammanfattning
   från användarens egna loggar, cachad per vecka.
3. Utvärdera ev. grundad assistent senare, med strikta gränser.
