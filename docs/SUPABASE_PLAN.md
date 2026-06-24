# Supabase-integrationsplan (PLAN, ej implementation)

> Status: **godkänd riktning, inget byggt.** Ingen Supabase-kod, ingen auth,
> inga migrations ännu. Backend kopplas in smalt och kontrollerat, en söm i
> taget, inte som ett stort "nu bygger vi allt"-pass.

## Princip

BaaS-först: Supabase = backend (Postgres + Auth + Storage + Edge Functions). Vi
bygger ingen egen Node-/Azure-backend nu (Azure hör till AEOmotor, inte hit).

Vårt service-lager (`src/services/*`) är redan sömmen mellan UI och data: vi
byter bara funktionernas *innehåll* från mock till Supabase, signaturerna är
oförändrade och **UI rörs inte**.

```ts
// nu
export async function getBreeds(): Promise<Breed[]> { return breeds; }
// senare (samma signatur)
export async function getBreeds(): Promise<Breed[]> {
  const { data, error } = await supabase.from('breeds').select('*');
  if (error) throw error;
  return data;
}
```

## Tabeller (mappar mot befintliga `src/types`)

| Ordning | Tabell | Vår typ | Åtkomst | Risk |
|---|---|---|---|---|
| 1 | `breeds` | `Breed` (+ `BreedProfile` senare) | **public read-only** | låg |
| 2 | `profiles` | Auth-kopplad användare | privat per user | låg |
| 3 | `dogs` | `Puppy` | privat per user | medel |
| 4 | `growth_logs` | `GrowthLog` | privat per user | medel |
| senare | `milestones`, `challenges`, `memories`, `weekly_digests` | resp. typ | privat per user | – |

## Schema-skiss (förslag — inga migrations skapade)

```
profiles
  id uuid pk                 (= auth.users.id)
  display_name text
  created_at timestamptz default now()

breeds
  id text pk                 (vår BreedId, t.ex. 'golden-retriever')
  name text not null
  -- senare: group, size_class, short_description, temperament[], source_url

dogs
  id uuid pk default gen_random_uuid()
  owner_id uuid not null references profiles(id)
  name text not null
  breed_id text references breeds(id)
  date_of_birth date not null
  photo_url text
  created_at timestamptz default now()

growth_logs
  id uuid pk default gen_random_uuid()
  dog_id uuid not null references dogs(id) on delete cascade
  measured_at date not null
  weight_kg numeric
  withers_height_cm numeric
```

## RLS (säkerhetsgrund — obligatoriskt)

- **`breeds`: public read-only.** Läsbar utan inloggning via anon key, eftersom
  rasväljaren ligger i onboarding innan användaren loggat in. Inga skrivningar
  från appen.
- **`profiles` / `dogs` / `growth_logs`: privat per användare.** En användare får
  bara läsa/skriva sina egna rader (`owner_id = auth.uid()`; growth via `dog`
  som ägs av användaren).

## Hemligheter (hård regel — kopplar till `claude-guard`)

- **I appen (ok):** `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- **Aldrig i appen:** service-role-nyckel, OpenAI-nyckel, TheDogAPI-secret,
  Stripe-secret. De ligger som **Edge Function secrets**. Guarden blockerar redan
  hårdkodade nycklar.

## Var koden hamnar (följer Conventions i ARCHITECTURE.md)

- `src/lib/supabase.ts` — klienten (en gång).
- `src/services/*` — oförändrade signaturer; byt body mock → Supabase.
- Edge Functions (server-side) senare för: AI-veckodigest (`docs/AI.md`),
  TheDogAPI-import (`docs/BREED_DATA.md`), ev. Stripe.

## Utrullning (en söm i taget, lägst risk först)

1. **`breeds` (public read-only)** — skapa tabell, **handkurera de 10
   MVP-raserna** (ingen TheDogAPI-import ännu), byt `breedService.getBreeds()`.
   Ingen auth krävs. ← rekommenderad första riktiga backend-bit.
2. **Auth + `profiles`** — email-auth först (Apple/Google senare).
3. **`dogs`** — onboarding skriver, Today/Min valp läser (byt `puppyService`).
4. **`growth_logs`** — logga vikt/mankhöjd (byt `growthService`), driver
   tillväxtkurvan.
5. Resten: `milestones`/`challenges`/`memories` → `weekly_digests` (Edge
   Function).

## Beslut (låsta)

1. **Auth:** byggs inte nu. När det kommer: email först, Apple/Google senare.
2. **Rasdata:** handkurera de 10 MVP-raserna först. TheDogAPI-import/Edge
   Function senare.
3. **`growth_logs`** är rätt för vikt/mankhöjd. Generella dagliga loggar kan bli
   en separat `puppy_logs` senare.
4. **Lokal persistens:** behövs inte för `breeds`. För onboarding/dog-profil kan
   AsyncStorage eller Supabase direkt övervägas senare. Börja inte med det nu.

## Rätt nästa steg (i ordning)

1. Spara denna plan (klart med denna fil).
2. Skapa Supabase-projekt manuellt (dashboard).
3. Bekräfta de 10 MVP-raserna.
4. Slice 1: `breeds` public read-only — först efter att projektet finns och
   URL + anon key delats.
