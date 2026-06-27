# PuppyJourney - Product North Star (bindande riktning)

> Syfte: hjälpa framtida kod- och produktbeslut så att PuppyJourney inte glider
> mot tracker-/logg-/statistik-app. Appen ska kännas som en personlig kompanjon
> genom valpens första livsfas, inspirerad av Preglife/BabyJourney men anpassad
> för valpägare. Vid tveksamhet: välj resan, inte verktyget.

## North star

**"Jag bygger min valps första livskapitel."**

## Grundprincip

PuppyJourney ska **inte** byggas som:

`onboarding → tracker → loggar → statistik`

PuppyJourney ska byggas som:

`onboarding → veckomotor → personlig resa → små mål → minnen → utveckling → fördjupning`

## Låsta principer

### 1. Kompanjon, inte verktyg
Appen ska kännas som en följeslagare under en tidsbestämd livsförändring. Den ska
hjälpa användaren förstå, känna igen, spara och följa valpens utveckling, inte
bara mata in data.

### 2. Frivillig registrering
PuppyJourney ska på sikt kunna startas **utan konto**. Användaren skapar valpens
profil lokalt först. Konto/synk kommer senare som värdeerbjudande (spara, synka,
exportera, dela minnesboken), inte som startbarriär.

Språkregel: använd **"när användaren har skapat valpens profil"**. Undvik "när
användaren har skapat konto" som grundantagande.

### 3. Minimal onboarding
Samla bara det veckomotorn behöver:
- valpens namn
- hemkomstdatum
- biologisk ålder eller födelsedatum
- ras (med blandras/"vet inte" möjligt senare)

Hemkomstdatum = emotionell resa. Biologisk ålder = utvecklingskunskap. Ras =
personalisering och differentiering.

### 4. Veckomotorn är kärnan
`home_week_index` är PuppyJourneys motsvarighet till Preglifes graviditetsvecka.

`home_week_index` styr: veckotema, huvudkort, dagens mål, minnen, push (senare),
partnererbjudanden (senare), fördjupning.

`puppy_age_weeks` styr: utvecklingsinformation, träningsnivå, åldersrelevanta råd,
försiktighetskort.

### 5. Flerlagerprincip
Varje hemkomstvecka kan ha flera lager, men användaren möts av **ett enkelt
huvudflöde**.

Huvudflöde: huvudkort, dagens lilla mål, trygghetskort/reassurance, rasnotis,
läs mer, minne.

Senare lager: ljud, video, podd, kurs, partnererbjudande, checklista.

### 6. Rasdifferentiering är vårt övertag
Preglife har en relativt gemensam graviditetskurva. PuppyJourney ska anpassa
upplevelsen efter ras, storlek, aktivitetsnivå och hundvana.

Princip: **samma hemkomstvecka, olika valp.** En border collie, tax och labrador
ska inte kännas som exakt samma resa.

### 7. Minnen är emotionell kärna
Minnen är inte loggar. De är början på valpens minnesbok och första kapitel.

Använd: valpens profil, valpens resa, första kapitlet, spara minne, minnen från
valpens resa, små steg tillsammans.

Undvik (i användarcopy): loggning, tracker, aktivitetshistorik, prestation,
streak, digital footprint.

### 8. Kommersiell princip
Partnererbjudanden ska inte kännas som reklam. De ska vara hjälp i rätt ögonblick,
kopplade till hemkomstfasen och tydligt märkta. (Se `docs/PARTNER_AND_MONETIZATION_STRATEGY.md`.)

### 9. AI-princip
PuppyJourney ska inte positioneras som en AI-chattapp. AI används först bakom
kulisserna för att skapa, strukturera och kvalitetssäkra åldersanpassat och
rasrelevant innehåll. Användarupplevelsen ska kännas som en trygg valpresa, inte
ett fritt AI-svarssystem. En eventuell framtida AI-guide ska vara begränsad till
godkända källor, aldrig ge diagnoser, och alltid hänvisa vidare vid hälsa,
symptom eller osäkerhet. (Se `docs/AI_WORKFLOW.md` / `docs/CONTENT_ENGINE.md`.)

## Regler (denna fas)
Endast detta dokument. Ingen kod, ingen DB, ingen AI-integration, ingen
dependency, ingen commit utan godkännande. Detta är huvudriktningen som andra
beslut ska vägas mot.
