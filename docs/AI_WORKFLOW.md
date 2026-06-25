# AI-workflow för PuppyJourney (design / plan)

> Status: **plan, inget byggt.** Ingen AI-kod, ingen Edge Function, ingen
> provider-install, ingen SQL, ingen nyckel inlagd. Utökar `docs/AI.md` (kort
> AI-beslut) och bygger på `docs/BREED_DATA.md` (källmodell).

## Mål

På sikt ska appen kännas som Preglife/BabyJourney för valpägare: åldersbaserat
innehåll, rasprofil, veckokort, tips, loggar, milstolpar och trygg guidning.
Upplevelsen ska vara **lugn, förutsägbar och trygg** - inte "fråga en AI om
allt". AI är främst en **redaktionell motor bakom kulisserna**, inte en chatbot.

## AI-strategi i tre nivåer

1. **Redaktionell assistent (först).** Tar rådata från källor (DogAPI, API
   Ninjas, TheDogAPI ...) och skapar svenska **utkast**. Publicerar aldrig själv.
   Allt sparas som `draft` och måste bli `approved` innan det visas i appen.
2. **Personaliseringsmotor.** Appen känner valpens ålder, ras, storlek och
   användarens loggar. AI kan formulera dagens kort/veckans tips/en lugn
   sammanfattning. **Urvalet är deterministiskt** (ålder + ras + loggar styr
   vilket innehåll som visas), AI hjälper bara till att formulera.
3. **Valpcoach (senare).** Svarar bara utifrån godkänd kunskapsbas, hittar aldrig
   på hälsoråd. Frågor om symptom, smärta, kräkningar, feber, hälta, andning,
   förgiftning eller akut oro **routas till "kontakta veterinär"**, besvaras
   aldrig som diagnos.

## Provider-val

- **Primär kandidat: Berget AI** (hosted, OpenAI-kompatibelt API). Se
  `docs/AI_PROVIDER_STRATEGY.md` för det gällande provider-beslutet (Berget primär,
  OpenAI som fallback/tidigare alternativ). Skäl för OpenAI-kompatibel design:
  strukturerad JSON-output för kontrollerade fält som `title`, `summary`,
  `risk_level`, `source_ids`, `review_status`, samt modellbredd och låg friktion
  med TypeScript/Supabase.
- **Provider-abstraktion obligatorisk.** Allt går via ett internt
  `AIProvider`-interface så OpenAI/Gemini/Claude kan läggas till/bytas senare utan
  att röra resten. Ingen kod får anropa en providers SDK direkt utanför adaptern.
- **Fallback/senare:** OpenAI, Gemini (kostnad), Claude (långform redaktionellt).
  Börja inte med flera providers i backend samtidigt - onödig komplexitet tidigt.
- DogAPI / API Ninjas / TheDogAPI är **datakällor, inte AI-providers** - de hör
  hemma i `breed_source_data`, aldrig i intelligenslagret.

## Datamodell (föreslagen - bygg inte nu)

```
breed_source_data    -- rådata per källa (se docs/BREED_DATA.md)
   breed_id, source_name, source_breed_name, source_url,
   raw_json, fetched_at, license_note, match_confidence

breed_content_sv     -- svenska rastexter
   breed_id, field, title, summary, puppy_notes, care_notes,
   source_ids, ai_model, review_status (draft|approved), reviewed_by, updated_at

journey_content      -- ålders-/veckobaserat innehåll (Preglife-kärnan)
   week_number (8..52) eller month, title, body_sv, focus_points,
   source_ids, ai_model, review_status, updated_at

personalized_cards   -- genererade/valda kort för användaren
   id, dog_id, card_type, content_sv, generated_by (rule|ai),
   based_on (age, breed, logs), created_at

ai_generation_jobs   -- historik över AI-genereringar
   id, job_type, prompt, model, status, output, error,
   est_cost, created_at
```

## Content-pipeline (redaktionell)

```
raw source data  ->  AI draft (svenska)  ->  human review  ->  approved content  ->  app display
```
- AI måste ange vilka källfält/`source_ids` den använt.
- AI får inte skapa hälsopåståenden utan källa.
- Allt sparas som `draft`; appen visar bara `review_status = approved`.

## Runtime-pipeline (i appen)

```
puppy age + breed + logs  ->  deterministisk innehållsval  ->  (senare) valfri AI-sammanfattning
```
- Vilket innehåll som visas avgörs **deterministiskt** av ålder + ras + loggar,
  inte av live-AI vid varje appöppning.
- Exempel (Labrador, 10 veckor, loggar: sömn+vikt+socialisering): veckans
  utveckling, dagens tips, rasnotis, påminnelse, milstolpe, loggkort.
- AI kan formulera korten, men användaren ska uppleva appen som **stabil och
  trygg**, inte slumpmässig. Live-AI byggs inte in i kärnflödet.

## Säker arkitektur

```
Expo-app  ->  Supabase  ->  Edge Function  ->  AI-provider
          ->  sparar kontrollerat svar i Supabase
          ->  appen visar bara approved/published content
```
**Aldrig:** `Expo-app -> direkt till OpenAI med API-nyckel`.

- **Ingen AI-nyckel i Expo-klienten.** AI-nycklar och service-role/secret keys
  ligger server-side som **Supabase Edge Function secrets** (env vars), aldrig i
  app/bundle.
- Appen anropar en Edge Function; funktionen anropar AI-providern och returnerar
  ett kontrollerat, schema-validerat svar.

## Säkerhetsregler (bindande)

- **No medical diagnosis** - symptområd routas till veterinär.
- **No unsupported health claims** - ingen källa = inget hälsopåstående.
- **No direct AI key in app** - bara server-side via Edge Function secrets.
- **No auto-publishing** - AI-output är alltid `draft`.
- **review_status required** - appen visar bara `approved`.
- **Hälsa har strängare grind** - kräver `source_ids` + mänsklig `approved`,
  aldrig AI-only.
- **Moderation** på användarinput/AI-output när valpcoach (nivå 3) byggs.

## Status och avgränsning

- Detta är endast en plan. **Bygg inte** AI-kod, Edge Functions, SQL eller
  provider-integration nu. Ingen nyckel inlagd. Ingen commit/push utan
  godkännande.
- Naturlig ordning senare: datamodell -> redaktionell pipeline (nivå 1) ->
  deterministisk runtime + valfri sammanfattning (nivå 2) -> valpcoach med
  guardrails (nivå 3).
