# AI-provider-strategi för PuppyJourney (design / plan)

> Status: **plan + interface-förslag, ingen kod.** Ingen Edge Function, ingen
> API-nyckel, ingen provider-install, ingen self-hosting, ingen commit. Förfinar
> provider-delen i `docs/AI_WORKFLOW.md` (som nämnde OpenAI primär) — **detta
> dokument är den gällande provider-beslutet: Berget primär, OpenAI fallback.**

## Beslut

- **Hosted API, inte self-hosting.** Vi laddar inte ner modeller, sätter inte
  upp GPU/server/Docker, kör ingen inference lokalt. Vi anropar ett moln-API.
- **Primär provider: Berget AI** via deras **OpenAI-kompatibla** API
  (`baseURL: https://api.berget.ai/v1`). Berget kör öppna modeller som
  serverless inference i EU; vi hanterar ingen infrastruktur.
- **Fallback: OpenAI.** Samma SDK, annan `baseURL`/nyckel.
- **Provider-abstraktion obligatorisk.** Ingen kod anropar en providers SDK
  direkt utanför adaptern; allt går via ett `AIProvider`-interface så vi kan
  byta/lägga till Berget/OpenAI/Gemini/Claude utan att röra resten.

## Säker arkitektur (oförändrad från AI_WORKFLOW.md)

```
Expo-app  ->  Supabase  ->  Supabase Edge Function  ->  Berget API (eller OpenAI)
          ->  sparar AI-utkast (draft) i Supabase
          ->  appen visar bara approved/published content
```
- **Appen pratar aldrig direkt med Berget/OpenAI.** Annars kan API-nyckeln läcka
  i mobilen.
- **Ingen AI-nyckel i Expo-klienten.** `BERGET_API_KEY` / `OPENAI_API_KEY` ligger
  som **Edge Function secrets** (env vars), server-side.
- Adaptern körs bara i backend (Edge Function), aldrig i `src/` som bundlas.

## Föreslaget `aiProvider`-interface (server-side, ej byggt)

```ts
// framtida: backend/ai/types.ts — körs bara server-side (Edge Function)
export interface AIGenerateOptions {
  system: string;
  user: string;
  schema?: object;        // JSON-schema för strukturerad output
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResult<T = unknown> {
  data: T;                // VALIDERAD mot schema (zod) av adaptern
  provider: string;       // 'berget' | 'openai'
  model: string;
  usage?: { inputTokens?: number; outputTokens?: number };
}

export interface AIProvider {
  readonly name: string;
  generate<T>(opts: AIGenerateOptions): Promise<AIResult<T>>;
  moderate?(input: string): Promise<{ flagged: boolean; categories?: string[] }>;
}
```

Adaptrar (båda via OpenAI-SDK:n, olika baseURL/nyckel):

```ts
// BergetProvider (primär)
new OpenAI({ apiKey: process.env.BERGET_API_KEY, baseURL: "https://api.berget.ai/v1" });

// OpenAIProvider (fallback)
new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// fabrik: väljer provider via env, används bara i Edge Function
function getAIProvider(): AIProvider {
  return process.env.AI_PROVIDER === "openai" ? new OpenAIProvider() : new BergetProvider();
}
```

## Strukturerad output och validering (viktigt)

- Vi **validerar alltid AI-output mot schema med zod server-side**, oavsett
  provider. Vi litar inte på att providern garanterar strikt JSON-schema.
- OpenAI har strikt Structured Outputs; **öppna modeller via Berget kan ha
  svagare schema-tvång** (json-mode/function-calling varierar per modell). Därför
  är egen validering + retry/fallback obligatorisk (matchar vår zod-regel:
  kritiska fält strict, icke-kritiska defensive).
- Verifiera tillgängliga modeller, gränser och schema-stöd mot Bergets aktuella
  docs innan bygge.

## Kostnadsmodell (batch, inte live)

Berget tar betalt **per token**. Därför:
- **Gör inte:** varje appöppning -> live-AI genererar allt -> kostnad varje gång.
- **Gör:** AI genererar utkast i **batch** -> du godkänner -> sparas i Supabase
  -> appen visar färdigt, approved innehåll **utan ny AI-kostnad**.

Det ger Preglife/BabyJourney-känslan (stabilt, förpublicerat, åldersstyrt) och
låg, förutsägbar kostnad.

## Vad som INTE behövs

- Ingen superdator, ingen GPU, ingen egen server.
- Inga nedladdade modellvikter, ingen lokal inference.
- Ingen enorm databas för att starta: 10-20 rasprofiler räcker för första
  utkasten. Det som krävs för trovärdighet är **källspårning + review**, inte
  "mer AI".

## Status och avgränsning

- Endast docs + interface-förslag. **Bygg inte** adaptrar, Edge Functions, SQL
  eller provider-integration nu. Ingen nyckel inlagd. Ingen commit/push utan
  godkännande.
- Naturlig ordning senare: bekräfta Berget-modeller/limits -> implementera
  `AIProvider` + Berget/OpenAI-adaptrar i en Edge Function -> redaktionell
  batch-pipeline (draft -> review -> approved) enligt `docs/AI_WORKFLOW.md`.
