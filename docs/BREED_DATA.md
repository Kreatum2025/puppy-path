# Rasdata: källmodell, policy och pipeline (design / backlog)

> Status: **policy + datamodell, inget byggt.** Ingen import till Supabase än,
> ingen DB-ändring, ingen scraping. `breeds.json` (dogapi.dog) ligger untracked
> som källjämförelse-artefakt. Bygger additivt på slice 1 (`public.breeds`).

## Mål och princip

Målet är **trovärdig, svensk, kurerad rasinformation** där källa och grad av
granskning alltid är tydlig. Inte "flest raser snabbast".

- **Supabase = vår egen sanningskälla.** Externa API:er är *källor*, aldrig
  live-beroenden och aldrig auktoritativa ensamma.
- **Vi äger och kurerar.** Vi återpublicerar inte någon annans innehåll rakt av.
- **AI = redaktionell assistent**, aldrig faktakälla (se nedan).
- **Hälsa kräver extra försiktighet:** källa + mänsklig granskning innan publicering.

## Datamodell: tre nivåer + publicerad vy

```
public.breed_source_data   -- rådata per extern källa
   breed_id            text
   source_name         text      -- 'dogapi.dog' | 'api_ninjas' | 'thedogapi' ...
   source_breed_name   text
   source_url          text
   raw_json            jsonb      -- hela svaret, oförändrat
   fetched_at          timestamptz
   license_note        text       -- får datan lagras? villkor?
   attribution_required boolean
   match_confidence    numeric    -- hur säker rasmatchningen är

public.breed_references    -- SKK/RAS/FCI/rasklubb/veterinär (ENDAST referens)
   breed_id            text
   ref_type            text       -- 'SKK' | 'RAS' | 'FCI' | 'rasklubb' | 'vet'
   title               text
   url                 text
   note                text       -- manuell review-notering
   -- INGEN kopierad brödtext, inga RAS-PDF:er, inga hälsoavsnitt i klartext

public.breed_content_sv    -- vår egen svenska, granskade text
   breed_id            text
   field               text       -- 'description' | 'activity' | 'grooming' | 'health' ...
   value_sv            text       -- vår egen text
   source_refs         jsonb      -- vilka källor underbygger fältet
   derived_from        text       -- t.ex. 'api_ninjas.energy=4/5' för härledda fält
   review_status       text       -- 'draft' | 'approved'
   reviewed_by         text
   updated_at          timestamptz

public.breeds              -- PUBLICERAD appvy (det appen visar)
   -- visar bara fält med review_status = 'approved'
```

**Spårbarhetsexempel:** API Ninjas säger `energy = 4`. Det sparas som rådata i
`breed_source_data`. Vår tolkning "hög aktivitetsnivå" ligger i
`breed_content_sv` med `derived_from = 'api_ninjas.energy=4/5'` och
`review_status`. Vi sparar aldrig bara "hög" och glömmer varifrån den kom.

## Publiceringsgrind

- Appen visar **endast** `breed_content_sv`-fält med `review_status = 'approved'`.
- **Hälsa/sjukdomsrisker har strängare grind:** kräver ifyllt `source_refs` +
  mänsklig `approved`. Aldrig AI-only, aldrig fri generering.

## AI:s roll

AI **får**: översätta engelska källfält till svenska utkast, sammanfatta, skapa
valp-anpassade tips, normalisera namn, matcha raser mellan källor, flagga osäker
data, föreslå struktur.

AI **får inte**: hitta på sjukdomsrisker eller fakta utan källa, ersätta
veterinär/SKK/rasstandard, skriva medicinska råd, publicera automatiskt.

Pipeline: `källa (raw) → AI svenskt utkast (draft) → mänsklig granskning →
approved → publiceras i breeds`.

## SKK / RAS-policy (bindande)

RAS = SKK:s rasspecifika avelsstrategi (mål + beskrivning av hälsa, funktion,
mentalitet, genetisk variation, exteriör). Värdefullt som **underlag och
kontroll**, inte som material att automatiskt återpublicera.

- SKK/RAS får användas som **referens- och granskningskälla**, inte som
  automatiskt scrapead rådatakälla.
- **Ingen scraping av SKK. Ingen import av SKK-text.** Vi kopierar eller
  masshämtar inte SKK-texter, RAS-PDF:er eller hälsoavsnitt till Supabase.
- För SKK/RAS sparas **högst metadata, källa/länk och manuell review-notering**
  (i `breed_references`).
- Svenska rastexter och hälsoavsnitt är **egna texter**, skapade med AI-stöd men
  granskade innan publicering.
- Hälsodata kräver källspårning och `review_status` innan den visas i appen.

## Källjämförelse (per 2026-06-24)

| Källa | Raser | Styrka | Saknar | Lagring/licens |
|---|---|---|---|---|
| dogapi.dog (kinduff) | 283 | namn, engelsk beskrivning, livslängd, vikt (kg), hypoallergen, grupp | bild, temperament, höjd, hälsa | öppen/fri; men verifierar ej facts |
| API Ninjas | ~200 | bild, egenskapspoäng (energi/pälsvård/familj/träningsbarhet), vikt+höjd | beskrivningstext; imperial enheter | free-plan tillåter sannolikt EJ lagring; kontrollera |
| TheDogAPI | 100+ | bilder, characteristics, ev. vet-granskade hälsotips (betald) | – | attribution krävs om appen monetiseras |
| SKK / RAS / FCI | – | svensk auktoritet, hälsa, rasstandard | upphovsrättsskyddat | endast referens, ej scraping |

**Roller:**
- **dogapi.dog** = primär rasKATALOG + grundbeskrivningar (raw source → kurera).
- **API Ninjas / TheDogAPI** = komplement för egenskaper + bilder, **endast om
  licensen tillåter lagring**.
- **SKK / RAS / FCI** = referens och manuell kvalitetssäkring, aldrig rådatakälla.

## Status och nästa steg

- Slice 1 klar: `public.breeds` (10 seed-raser, public read-only). Se
  `docs/SUPABASE_PLAN.md`.
- ⚠ API Ninjas-enrichment kördes på 9 rader men bör **nollställas** pga (a)
  lagringslicens-osäkerhet och (b) skräpvärden på multi-match-raser
  (cocker/poodle). Vänta på licensbesked.
- Ingen full import förrän datamodellen ovan finns och licenser är bekräftade.
- Inga destruktiva eller bulk-operationer utan godkännande.
