# PuppyJourney AI-benchmark (plan)

> Status: **plan + lokal benchmark-scaffolding, ingen körning, ingen integration.**
> Inte en AI-assistent, inte appintegration, ingen Supabase Edge Function. Ett
> kontrollerat benchmark för vår framtida content engine. Ingen API-nyckel i
> repo. Benchmarken körs **lokalt senare** med `BERGET_API_KEY` från `.env.local`.

## Mål

Avgöra vilken **Berget-modell** som bäst klarar PuppyJourneys content workflow:
tolka rasdata, sammanfatta källdata, skapa svensk apptext, skapa veckokort/dagens
tips, följa JSON-schema, hålla PuppyJourney-ton, **vägra hälsopåståenden utan
källa**, och vara kostnadseffektiv.

## Modeller, roller och pris

Pris per miljon tokens (in/ut) enligt Bergets prislista (bekräfta valuta):

| Berget modell-id | Roll | Pris in/ut per M |
|---|---|---|
| `mistralai/Mistral-Medium-3.5-128B` | kvalitetskandidat: svensk redaktionell apptext | 1.50 / 5.00 |
| `zai-org/GLM-5.2` | komplex sammanfattning, källtrohet, workflow-resonemang | 1.40 / 4.40 |
| `meta-llama/Llama-3.3-70B-Instruct` | kostnadseffektiv default-kandidat | 0.90 / 0.90 |
| `openai/gpt-oss-120b` | validator: JSON, policy, källtrohet, vägran utan källa | 0.20 / 0.75 |
| `mistralai/Mistral-Small-3.2-24B-Instruct-2506` | billig arbetsmodell: kort, rubriker, översättning | 0.30 / 0.30 |

`run.mjs` räknar **faktisk** kostnad ur token-usage med dessa priser. Bekräfta
att id:na finns: `node scripts/ai-benchmark/run.mjs --list-models`.

## Testuppgifter (10)

1. Skapa svensk rasprofil från DogAPI-rådata.
2. Skapa veckokort för en 10 veckor gammal valp (max 80 ord).
3. Skapa dagens tips i PuppyJourney-ton.
4. Returnera JSON enligt exakt schema.
5. Vägra hälsopåstående utan källa (symptom -> hänvisa veterinär).
6. Sammanfatta källdata utan att hitta på.
7. Skapa kort apptext med max 80 ord.
8. Bevara `source_ids` korrekt.
9. Klassificera om text får publiceras eller kräver mänsklig review.
10. Förkorta en text utan att tappa saklighet.

Prompts, scheman och längdgränser finns i `scripts/ai-benchmark/config.mjs`.

## Scoring (per modell, per uppgift)

| Dimension | Hur | Skala |
|---|---|---|
| Svensk kvalitet | manuell | 0-5 |
| Ton (trygg, varm, saklig) | manuell | 0-5 |
| Instruktionsefterlevnad | manuell | 0-5 |
| JSON-validitet | automatisk | pass/fail |
| Källtrohet (bara givna fält, source_ids intakta) | manuell | 0-5 |
| Hallucinationer | manuell | 0-5 (5 = inga) |
| Hälsosäkerhet (vägrar ogrundat) | manuell + auto-flagga | 0-5 |
| Längdkontroll (ord <= gräns) | automatisk (`words`/`length_ok`) | pass/fail |
| Latens | automatisk (ms) | mätt |
| Faktisk tokenkostnad | automatisk (usage x pris) | mätt |
| Fel/timeout | automatisk | räknas |

`run.mjs` mäter det automatiska (JSON-validitet, längd, latens, tokens/kostnad,
fel) och sparar råoutput. Det subjektiva fylls i manuellt enligt `scoring.md`.

## Så körs den (senare, lokalt)

```
node scripts/ai-benchmark/run.mjs --list-models   # bekräfta modell-id
node scripts/ai-benchmark/run.mjs                 # kör benchmark
# -> scripts/ai-benchmark/results/run-<ts>.json  (gitignored)
```

## Regler

- Ingen API-nyckel i Expo eller klientkod. `BERGET_API_KEY` läses från
  `.env.local` (gitignored) eller env, skrivs aldrig ut.
- Ingen Supabase Edge Function, ingen appintegration, ingen databasändring.
- Inga provider-SDK:er (run.mjs använder inbyggd `fetch`).
- Ingen commit/push utan godkännande. `results/` committas inte.
- Benchmarken körs inte förrän du godkänner.
