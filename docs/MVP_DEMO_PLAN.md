# MVP-demo-plan för testanvändare (plan, ingen kod än)

> Status: **plan/roadmap, inget byggt i denna uppgift.** Ingen DB-migration utan
> separat godkännande, ingen commit utan godkännande. Bygger på den befintliga
> Expo-prototypen och `docs/PRODUCT_MECHANICS.md` / `docs/IMPLEMENTATION_PLAN.md`.

## Mål

Inte full app. **Bevisa känslan: "Jag bygger min valps resa"** - och att den är
värd att dela. Fokus: emotionell resa + social spridning (delningskort).

## Utgångspunkt: vad som redan finns

Prototypen har redan: Welcome, onboarding-flöde, Today-skärm, `PuppyShareCard`
(3 teman), loggning, minnes-tomt-state, Reanimated-animationer, design system.
Demon **anpassar** detta till hemkomstmodellen + lägger till mätning och riktig
delning. Vi bygger alltså inte från noll.

⚠ Anpassning som krävs: prototypen är idag biologisk-veckobaserad ("vecka 8-52").
Demon ska använda **hemkomstbaserad** copy (`home_week_index`) + biologisk ålder
(`puppy_age_weeks`) som kunskap, enligt låst terminologi.

## Skärmar att bygga/anpassa

1. **Welcome** (finns) - kort, emotionell intro.
2. **Onboarding** (anpassa): namn → ras → biologisk ålder → hemkomstdatum →
   `onboarding_info`-kort "Innan valpen kom hem till dig" → "Första veckan hemma".
3. **Hemskärm** (anpassa Today): "Första veckan hemma" + "Luna är 10 veckor" +
   ett huvudkort (weekly_development) + dagens lilla mål + reassurance-kort +
   rasnotis.
4. **Mål/minne-interaktion** (anpassa loggning): markera mål som gjort (mjuk
   feedback, ingen streak/press); spara minne (bild/text) som "Veckans minne".
5. **Delningskort** (anpassa `PuppyShareCard`): snyggt kort + riktig
   bild-export + OS-delning.

(Profil/Min valp är valfri för demon - hålls minimal eller utelämnas.)

## Demo-innehåll (statiskt, inget AI)

"Första veckan hemma"-korten seedas lokalt (kurerade exempel ur
`docs/PRODUCT_MECHANICS.md`): weekly_development, daily_goal, reassurance,
breed_note. Markerade som färdiga för demo - **ingen AI, ingen live-generering**.

## Roadmap (demo-slices)

- **D1 Onboarding (hemkomstmodell):** fält namn/ras/biologisk ålder/hemkomstdatum,
  beräkna `home_week_index` + `puppy_age_weeks`, visa `onboarding_info`-kortet.
  Event: `onboarding_completed`.
- **D2 Hemskärm:** "Första veckan hemma" + "Luna är 10 veckor", huvudkort + dagens
  mål + reassurance + rasnotis, luftig layout (ett huvudkort). Event:
  `weekly_card_viewed`.
- **D3 Mål/utmaning:** "markera som gjort" → mjuk, varm feedback. Ingen streak,
  ingen press. Event: `goal_completed`.
- **D4 Minne:** spara bild/text som "Veckans minne". Event: `memory_saved`.
- **D5 Delningskort:** skapa kort (namn, hemkomstvecka, milstolpe/minne,
  PuppyJourney-branding, **ingen privat data**), riktig bild-export +
  frivillig delning via OS-delningsark. Event: `share_card_created`,
  `share_card_shared`.
- **D6 Mätning (lokal):** lättviktig event-logger (in-memory/AsyncStorage, ingen
  backend) + enkel debug-vy för att se funneln under test.

Ordningsförslag: D1 → D2 → D3 → D4 → D5 → D6 (D6 kan vävas in löpande).

## Testmätning (lokala events, ingen backend)

`onboarding_completed`, `weekly_card_viewed`, `goal_completed`, `memory_saved`,
`share_card_created`, `share_card_shared`. Loggas lokalt för att validera
funneln (ingen tracking-backend, ingen persondata skickas någonstans).

## Delningskort - krav

- Visar: valpens namn, "Första veckan hemma" (hemkomstvecka), milstolpe/minne,
  PuppyJourney-branding.
- **Ingen privat data** (ingen exakt adress, inga personuppgifter).
- **Frivillig delning** - användaren väljer aktivt att dela.
- Riktig bild-export krävs för social spridning (kräver troligen
  `react-native-view-shot` + `expo-sharing` - separat beroende-godkännande vid
  bygge).

## Acceptanskriterium

En testanvändare kan: onboarda → se "Första veckan hemma" → markera ett mål som
gjort → spara ett minne → skapa och dela ett delningskort. De 6 mätevents syns i
debug-vyn. Känslan av att "bygga valpens resa" ska vara tydlig.

## Avgränsning (bindande)

Ingen AI-chatbot. Ingen partnerintegration. Ingen försäkring. Ingen betalning.
Ingen DB-migration utan separat godkännande. Ingen commit utan godkännande.
Statiskt demo-innehåll, lokal state, ingen backend.
