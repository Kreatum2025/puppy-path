# PuppyJourney AI-benchmark (lokal)

Fristående benchmark som jämför Berget-modeller på PuppyJourneys content
workflow. **Ingen app-/DB-integration. Ingen nyckel i repo.** Se
`docs/AI_BENCHMARK.md` för plan, uppgifter och scoring.

## Köra (lokalt, senare)

Nyckeln läses från `.env.local` (`BERGET_API_KEY=...`, redan gitignored) eller
från env-variabeln `BERGET_API_KEY`. Den committas aldrig och skrivs aldrig ut.

```bash
# 1. bekräfta exakta modell-id och mappa dem i config.mjs (bergetModelId)
node scripts/ai-benchmark/run.mjs --list-models

# 2. kör benchmark (hoppar modeller vars bergetModelId = TODO-confirm)
node scripts/ai-benchmark/run.mjs

# valfri experimentmodell (GLM-5.2)
node scripts/ai-benchmark/run.mjs --include-optional
```

Resultat sparas i `scripts/ai-benchmark/results/` (gitignored). Automatiskt mäts
JSON-validitet, latens, tokens och fel. Subjektiv scoring fylls i manuellt i
`scoring.md`.

## Filer
- `config.mjs` - modeller, system-prompt, 10 uppgifter + scheman
- `run.mjs` - runner (inbyggd fetch, inga beroenden)
- `fixtures/breeds.sample.json` - riktig DogAPI-data för 3 raser
- `scoring.md` - scoring-rubrik + ifyllningsmall
- `results/` - körningar (committas ej)
