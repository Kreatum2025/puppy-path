# PuppyJourney

> Följ din valps första år, vecka för vecka.
> _PuppyJourney – your puppy's first year, week by week._

En lugn, personlig valpresa-app: skapa en valpprofil, följ nuvarande vecka,
logga vikt, mankhöjd, bilder, milstolpar och utmaningar, läs en lugn
veckoguide och skapa ett vackert delningskort. Inspirerad av premium
baby-/familjeappar (Preglife/BabyJourney), anpassad för valpägare.

Det här är **inte** en hundträningsapp, veterinärapp, generisk hundguide eller
community-app. Det är en personlig minnes- och utvecklingsresa.

## Status: interaktiv high-fidelity-prototyp (Steg 1–2)

Den här versionen är en **klickbar, känslomässigt levande prototyp med
mockdata**. Den visar hela den emotionella loopen:

skapa profil → se nuvarande vecka → logga (mock) vikt/mankhöjd/bild/milstolpe/
utmaning → se veckoprogress och belönande feedback → förhandsvisa AI-placeholder
→ skapa delningskort.

Medvetet **inte** med ännu (kommer senare): Supabase, auth, backend, storage,
riktig AI, betalningar, App Store-konfiguration, bildexport av delningskortet.

## Kör lokalt

```bash
npm install
npx expo start
```

Öppna i Expo Go (iOS/Android) eller en simulator. Webb: `npx expo start --web`.

Kvalitetskontroller:

```bash
npx tsc --noEmit      # typecheck
npx expo lint         # eslint
```

## Stack

- Expo (SDK 56) · React Native · TypeScript (strict)
- Expo Router (file-based navigation: stack + tabs + modal)
- React Native Reanimated (enda animationsbiblioteket — disciplinerat)
- Google Fonts: Fraunces (display) + Inter (UI)
- Endast lokal mockdata. Inga backend-beroenden.

## Arkitektur i korthet (contract-first)

UI känner aldrig till varifrån datan kommer. Tre lager:

1. **UI** – `app/` (skärmar) + `src/components` + `src/features`
2. **Service** – `src/services/*` returnerar mockdata nu, byts mot Supabase senare
   utan att UI ändras
3. **Typer/data** – `src/types` (motsvarar framtida DB-tabeller) + `src/data` (mock)

Se [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) för detaljer och
[docs/PROGRESS.md](docs/PROGRESS.md) för byggstatus.

## Designriktning

Modern skandinavisk premium, lugn skogs-/naturkänsla. Cream/beige bakgrund,
rundade kort, mjuka skuggor, tydlig typografihierarki. Designtokens i
`src/theme` — inga hårdkodade färger i komponenter.
