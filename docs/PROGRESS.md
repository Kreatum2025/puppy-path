# Byggstatus

## Klart — Steg 1–2: interaktiv high-fidelity-prototyp

### Steg 1 — Projektstruktur + design system
- [x] Expo + TypeScript + Expo Router (root `app/`, `src/` för allt annat)
- [x] Designtokens: `colors`, `spacing`, `radius`, `typography` (Fraunces + Inter)
- [x] Bas-komponenter: AppText, AppButton, AppCard, AppHeader, SectionTitle,
      StatPill, ProgressBar, ScreenContainer, Toast, PathMark, PuppyAvatar
- [x] Datamodell (`src/types`) + mockdata (`src/data`) + service-lager
      (`src/services`) + ren logik (`src/lib`)
- [x] In-memory `PuppyContext`

### Steg 2 — Skärmar (interaktiva, mockdata)
- [x] Welcome
- [x] Onboarding: intro → namn → ras → ålder → bild → mått → reward ("klar")
- [x] Tabbar: Idag, Min valp, Resan, Guide, Erbjudanden
- [x] **Today** (kärna): profilkort + nuvarande vecka/progress, tillväxt,
      veckans gamification ("2 av 5"), "Logga idag"-actions med success-feedback,
      veckoguide, AI-digest-placeholder, delningskorts-CTA, partner-exempel
- [x] Min valp (profil): foto, fakta, milstolpar, utmaningar, minnen (empty state)
- [x] Resan: tidslinje vecka 8–52 (8–16 innehåll, 17–52 "Kommer snart")
- [x] Guide: kategori-hub
- [x] Erbjudanden: livscykel-baserade placeholders ("Partnerplats – exempel")
- [x] Delningskort (modal): 3 teman (Forest/Cream/Minimal), speglar loggad data

Kvalitet: `tsc --noEmit` ✔ · `expo lint` ✔ · `expo export` bundlar ✔

## Backlog — nästa inkrement (en commit i taget)
- [ ] `expo-image-picker` för riktig profil-/veckobild
- [ ] Bildexport av delningskortet (`react-native-view-shot` + `expo-sharing`)
- [ ] Veckoinnehåll 17–24+
- [ ] Persistens av onboarding/loggar (lokalt) innan backend

## Senare (ej i denna fas)
- [ ] Supabase (DB, auth, storage, RLS, migrations)
- [ ] Backend-funktion för riktig AI Weekly Digest (från egen loggdata)
- [ ] RevenueCat (premium), Sentry (fel), PostHog (analytics)
- [ ] App Store / app-ikon (riktig assetproduktion enligt PathMark-riktningen)
