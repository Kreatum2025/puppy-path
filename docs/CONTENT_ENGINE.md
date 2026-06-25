# PuppyJourney som content engine (design / plan)

> Status: **plan, inget byggt.** Ingen SQL, ingen Supabase-ändring, ingen
> provider-integration, ingen API-nyckel, ingen commit. Knyter ihop
> `docs/AI_WORKFLOW.md`, `docs/AI_PROVIDER_STRATEGY.md` och `docs/BREED_DATA.md`.

## Vad PuppyJourney är (och inte är)

PuppyJourney är en **AI-driven content engine**, likt mekaniken i
Preglife/BabyJourney - inte en AI-assistent eller chatbot. AI arbetar **bakom
kulisserna** för att tolka källdata, sammanfatta, skapa svenska utkast,
strukturera content cards och kvalitetsvalidera. Appen visar **godkänt,
ålders- och rasbaserat innehåll**, inte fri live-AI.

### AI-workflow vs AI-chatbot

| | AI-chatbot (gör vi INTE nu) | Content engine (gör vi) |
|---|---|---|
| När körs AI | Live när användaren frågar | I batch, i förväg, bakom kulisserna |
| Output | Oförutsägbar fritext | Granskade, strukturerade kort |
| Risk | Kan hitta på hälsoråd | Bara approved, källförsedd text |
| Kostnad | Per fråga, varje gång | En gång per innehåll, sedan gratis att visa |
| Känsla | "Fråga AI om allt" | Lugn, förutsägbar, trygg tidslinje |

## Timeline / hur innehåll väljs

Appen är en **tidslinje** över valpens första år. Vilka kort som visas avgörs
**deterministiskt** av tre saker - inte av live-AI:

```
valpens ålder (-> stage)  +  ras  +  användarens loggar
      -> deterministiskt urval av APPROVED-kort
      -> (senare, valfritt) AI-formulerad sammanfattning ovanpå
```

Exempel (Labrador, 10 veckor, loggar: sömn + vikt + socialisering):
- `weekly_development` för vecka 10
- `breed_note` för Labrador + vecka 10
- `daily_tip` (roterande)
- `log_prompt` för det som inte loggats än
- `milestone` att sikta på
- `reminder` / `reassurance`

Ingen AI anropas i detta basflöde. Allt är förpublicerat och godkänt.

## Föreslagen datamodell (bygg inte nu)

```
puppy_stages         -- tidslinjens hållpunkter
   id, week_from, week_to, label_sv, sort_order

journey_content      -- åldersbaserat, rasoberoende innehåll
   id, stage_id, card_type, title_sv, body_sv, focus_points,
   source_ids, ai_model, review_status (draft|approved), updated_at

breed_stage_content  -- ras- OCH åldersbaserat innehåll
   id, breed_id, stage_id, card_type, content_sv,
   source_ids, ai_model, review_status, updated_at

content_cards        -- publicerade kort-instanser som appen läser
   id, card_type, scope (global|breed), stage_id, breed_id (nullable),
   ref_table, ref_id, review_status

ai_generation_jobs   -- historik/observability för AI-körningar
   id, job_type, stage_id, breed_id, input_source_ids, prompt,
   provider, model, status, output, error, est_cost, created_at

review_queue         -- mänsklig granskning innan publicering
   id, ref_table, ref_id, status (pending|approved|rejected),
   reviewer, notes, created_at, reviewed_at
```

`puppy_stages` definierar tidslinjen; `journey_content` + `breed_stage_content`
är källan; `content_cards` är den publicerade vyn appen läser; `review_queue` är
grinden; `ai_generation_jobs` ger spårbarhet och kostnadsöversikt.

## AI-kedjan (batch, bakom kulisserna)

1. **Source Analyzer** - läser rådata (`breed_source_data`, DogAPI/API Ninjas
   där licens tillåter) och plockar relevanta fält per ras/stage.
2. **Content Planner** - bestämmer vilka kort som behövs per stage/ras och vilka
   källfält som ska användas.
3. **Swedish Writer** - skapar svenska **utkast** (draft) i rätt tonalitet, med
   `source_ids`.
4. **Safety Validator** - kontrollerar mot säkerhetsreglerna (inga
   ogrundade hälsopåståenden, inga diagnoser, symptom -> hänvisa veterinär).
5. **JSON Validator** - validerar mot schema (zod) så fälten är kontrollerade.
6. **Human Review** - du godkänner/justerar i `review_queue`.
7. **Publish** - `review_status = approved` -> syns i `content_cards`.

AI gör steg 1-5 (utkast), människa gör steg 6, först då steg 7.

## Korttyper

- `weekly_development` - veckans utveckling
- `daily_tip` - dagens lilla tips
- `breed_note` - rasnotis för stage
- `milestone` - milstolpe att sikta på / fira
- `log_prompt` - uppmaning att logga (vikt, bild, mm)
- `reassurance` - lugnande "det här är normalt"
- `reminder` - påminnelse (avmaskning, besök, träning)
- `care_note` - skötsel (päls, klor, tänder)

## Publiceringsregler (bindande)

- **No auto-publish.** AI-output är alltid `draft`.
- **`review_status = approved` krävs** innan något visas i appen.
- **Inga hälsopåståenden utan källa.** Hälsa har strängare grind (källa +
  mänsklig approved), aldrig AI-only. Symptområd -> "kontakta veterinär".
- **AI är redaktionell assistent, inte faktakälla.**
- **Appen får inte vara beroende av live-AI** för basupplevelsen - tidslinjen
  fungerar på förpublicerat, godkänt innehåll.

## Status och avgränsning

Endast design. Bygg inte datamodell, SQL, AI-kedja eller provider-integration
nu. Ingen nyckel, ingen commit/push utan godkännande. Naturlig ordning senare:
`puppy_stages` + `content_cards` -> redaktionell batch-pipeline (AI-kedjan) ->
deterministiskt runtime-urval i appen.
