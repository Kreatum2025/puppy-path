# Implementationsplan: AI content engine (plan, ingen kod)

> Status: **plan, inget byggt.** Ingen kod, ingen DB-ändring, ingen import, ingen
> AI-nyckel i Expo, ingen commit. Knyter ihop `docs/CONTENT_ENGINE.md`,
> `docs/AI_WORKFLOW.md`, `docs/AI_PROVIDER_STRATEGY.md`, `docs/BREED_DATA.md`,
> `docs/DATA_QUALITY_PLAN.md`, `docs/AI_BENCHMARK.md`.

Mål: en **AI-driven content engine** (inte chatbot) där valpens ålder, ras och
loggar styr vilka **approved** content cards användaren ser, likt
Preglife/BabyJourney.

## 0. Förkrav: benchmark först

Bygg inte ny datamodell innan vi vet hur AI presterar. Kör först
`scripts/ai-benchmark` (5 Berget-modeller × 10 uppgifter) och välj roller:
**Swedish Writer** (kvalitet), **Safety/JSON Validator** (GPT-OSS-120B-kandidat),
**arbetsmodell** (billig). Resten av planen antar att dessa roller är valda.

## 1. Data pipeline: breed_source_data -> breed_fact_brief

```
extern källa (DogAPI ...) --import--> breed_source_data (raw_json, källa, licens)
breed_source_data --deterministisk normalisering--> breed_fact_brief
```

`breed_fact_brief` = ett **normaliserat, källverifierat faktablad per ras** som
är AI:ns enda tillåtna faktaunderlag (AI får bara omformulera dessa fakta, aldrig
lägga till). Föreslagen form:

```
breed_fact_brief = {
  breed_id, name_sv, name_en,
  facts: {
    life_span:     { min, max, source_ids, status:'source_verified' },
    weight_kg:     { male:{min,max}, female:{min,max}, source_ids, status },
    size:          { value, derived_from:'weight_kg', status:'normalized' },
    hypoallergenic:{ value, source_ids, status },
    group:         { value, source_ids, status },
  },
  source_ids: [...],
  generated_at
}
```

Briefen är **deterministisk** (ingen AI hittar på fakta). AI används här på sin
höjd för namnnormalisering/rasmatchning, inte för faktavärden.

## 2. AI content workflow (batch, bakom kulisserna)

| Steg | Input | Gör | Output | AI? |
|---|---|---|---|---|
| Source Analyzer | breed_source_data | normaliserar -> faktablad | breed_fact_brief | nej (ev. AI för namnmatchning) |
| Content Planner | fact_brief + stage | bestämmer vilka kort som behövs | kortplan | nej (deterministisk) |
| Swedish Writer | fact_brief + kortplan | skriver svenska utkast (bara brief-fakta) | `ai_draft` | ja (Writer-modell) |
| Safety Validator | ai_draft | hälso-/policy-/JSON-/längdkontroll | pass/fail + flaggor | ja (Validator) + deterministisk |
| Human Review | draft + flaggor | godkänn/justera/avvisa | `approved`/`rejected` | nej (människa) |
| Publish | approved | publiceras | content_cards | nej |

Regel: hälsa kräver källa; symptom -> hänvisa veterinär; inget publiceras utan
mänsklig `approved`.

## 3. App runtime (deterministiskt urval, ingen live-AI)

Två tidsfält styr urvalet (se `docs/PRODUCT_MECHANICS.md`). "Vecka 1" som
fristående UI-begrepp är förbjudet; journey-copy är hemkomstbaserad.

- `home_week_index` (veckor sedan hemkomst) -> emotionell resa.
- `puppy_age_weeks` (biologisk ålder) -> kunskap/utveckling.

```
input: home_week_index, puppy_age_weeks, breed_id, logs
cards = []
# emotionell resa (hemkomstbaserad)
cards += approved journey_content[home_week_index] för
        {weekly_development, daily_goal, challenge, milestone, memory_prompt}
cards += log_prompt för varje veckosak som INTE loggats (ur logs)
# kunskap (biologisk ålder)
cards += approved breed_stage_content[breed_id, puppy_age_weeks]   // breed_note
cards += approved age_content[puppy_age_weeks] för {reassurance, care_note}
return cards   // ingen AI anropas här
```

## 4. Content card-typer

| Typ | Scope | Källa | Kräver approved |
|---|---|---|---|
| weekly_development | global per stage | journey_content | ja |
| daily_tip | global | journey_content | ja |
| breed_note | per ras + stage | breed_stage_content (ur fact_brief) | ja |
| milestone | global per stage | journey_content | ja |
| log_prompt | runtime, ur logs | deterministisk | nej (ingen text-AI) |
| reassurance | global per stage | journey_content | ja |
| care_note | global per stage | journey_content | ja |
| reminder | global per home_week | journey_content | ja |
| onboarding_info | engångs efter åldersinmatning (8-12v) | statisk/granskad | ja |

Index: `weekly_development`/`daily_goal`/`daily_tip`/`milestone`/`memory_prompt`/
`reminder` styrs av `home_week_index`; `breed_note`/`reassurance`/`care_note` av
`puppy_age_weeks`. `onboarding_info` ("Innan valpen kom hem till dig") visas en
gång efter åldersinmatning när `puppy_age_weeks` är 8-12, inte i veckoflödet
(se `docs/PRODUCT_MECHANICS.md`).

## 5. Review status (per fält/kort)

`raw_imported -> normalized -> ai_draft -> source_verified -> human_reviewed -> approved` (eller `rejected`). Appen visar bara `approved`. Faktafält som är
`source_verified` (deterministiskt rimlighetskollade) får visas utan mänsklig
review; all fritext/tolkning/hälsa kräver `approved`. (Se DATA_QUALITY_PLAN.md.)

## 6. Första testcase (pilot)

**Labrador, Tax, Border Collie - biologisk ålder 10 veckor, första veckan hemma
(`home_week_index = 1`).** Alla tre finns i `breeds.json`.

Acceptanskriterier:
1. `breed_fact_brief` genererad för var och en (endast DogAPI-fakta, source_ids satta).
2. Writer skapar svenska utkast: `weekly_development` (<=80 ord body), `daily_tip`,
   `breed_note` - i PuppyJourney-ton, inga hälsopåståenden, source_ids bevarade.
3. Safety Validator: JSON-valid, längd ok, inga ogrundade hälsopåståenden.
4. Human Review godkänner minst `weekly_development` + `breed_note` per ras.
5. Runtime-urval för (Labrador, `home_week_index=1`, `puppy_age_weeks=10`)
   returnerar de approved korten deterministiskt.

Mål: varje ras har >=3 approved kort som visas korrekt för första veckan hemma. Detta
validerar hela kedjan på liten skala innan vi skalar till fler raser/veckor.

## 7. Föreslagen byggordning (gated slices, efter benchmark)

- **A. Schema** (DB-migration, separat godkännande): `breed_source_data`,
  `puppy_stages`, `journey_content`, `breed_stage_content`, `content_cards`,
  `review_queue`, `ai_generation_jobs`. `breed_fact_brief` som vy/härledning.
- **B. Deterministisk import + brief**: DogAPI (3 raser) -> source_data ->
  fact_brief.
- **C. Edge Function (Berget Writer)**: fact_brief -> `ai_draft`. Nyckel
  server-side.
- **D. Safety Validator + JSON-schema**.
- **E. review_queue + approve-flöde**.
- **F. App runtime**: deterministiskt urval som läser bara `approved`.

Varje slice: grön verify, ingen hälsa utan källa, ingen AI-publicering, ingen
nyckel i appen, egen commit efter granskning.

## Regler (denna fas)

Ingen live-chatbot. Ingen hälsodata utan källa. Ingen AI-only-publicering. Ingen
API-nyckel i Expo. Ingen databasändring. Ingen import. Ingen commit/push utan
godkännande.
