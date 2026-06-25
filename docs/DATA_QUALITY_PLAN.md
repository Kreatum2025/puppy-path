# Datakvalitetsplan: rasdata (plan, ingen import)

> Status: **plan, inget byggt.** Ingen databasändring, ingen import, ingen
> TheDogAPI-integration, ingen scraping, ingen commit. Bygger på
> `docs/BREED_DATA.md` (källmodell) och faktiskt verifierat läge nedan.

## Princip

Datakvalitet och rätt licens går före antal raser. Supabase är vår egen
sanningskälla; externa API:er är bara källor; AI tolkar/sammanfattar men är
aldrig faktakälla; hälsa kräver källa + licens + mänsklig `approved`.

## Faktiskt läge (verifierat 2026-06-25)

**Supabase `public.breeds` (10 seed-rader):**
- Ifyllt 10/10: `name_sv`, `name_en`, `size`.
- Null 0/10: `life_span`, `image_url`, `activity_level`, `grooming_needs`,
  `beginner_friendly`, `family_friendly`, `short_description_sv`,
  `puppy_notes_sv`, `source_note` (API Ninjas-data borttagen pga licensosäkerhet).

**DogAPI (`breeds.json`, 283 raser, 100% täckning):** `name` (EN),
`description` (EN), `life {min,max}`, `male_weight`/`female_weight` (kg),
`hypoallergenic`, `group` (relation). Saknar bild, höjd, temperament/egenskaper,
hälsa.

## Fältstatus (livscykel)

Varje fältvärde har en status:

`raw_imported` -> `normalized` -> `ai_draft` -> `source_verified` -> `human_reviewed` -> `approved` (eller `rejected`)

- **raw_imported**: rådata från extern källa, oförändrad (i `breed_source_data`).
- **normalized**: enheter/format normaliserade (t.ex. kg/cm, "10-12 år").
- **ai_draft**: AI-genererat svenskt utkast (översättning/sammanfattning).
- **source_verified**: faktafält kontrollerat mot källa + deterministisk
  rimlighetskontroll (range/enum). Får visas utan mänsklig review (se nedan).
- **human_reviewed**: människa har läst och justerat.
- **approved**: godkänt för publicering i appen.
- **rejected**: underkänt, visas aldrig.

## Fältmatris

Kolumner: **Behövs** | **Har nu** | **DogAPI** | **TheDogAPI (om licens köps)** |
**Kräver manuell/vet-källa** | **App-visning**.

| Fält | Behövs | Har nu | DogAPI | TheDogAPI* | Manuell/vet | App-visning |
|---|---|---|---|---|---|---|
| rasnamn (en) | ja | ja (name_en) | ja | ja | nej | utan review (source_verified) |
| svensk rasnamnsvariant | ja | ja (name_sv) | nej | nej | ja (kuratering) | utan review |
| engelsk beskrivning | intern | nej | ja | ja | nej | visas ej i app (underlag) |
| svensk beskrivning | ja | nej | nej | nej | AI-utkast + review | **endast approved** |
| livslängd | ja | nej (null) | ja | ja | nej | utan review (source_verified) |
| vikt (kg) | ja | nej (saknar kolumn) | ja | ja (imperial) | nej | utan review |
| höjd (cm) | ja | nej (saknar kolumn) | nej | ja (imperial) | nej | utan review |
| storlek | ja | ja (size) | härled ur vikt | ja | nej | utan review |
| aktivitetsnivå | ja | nej | nej | ja (poäng) | tolkning + review | **endast approved** |
| pälsvård | ja | nej | nej | ja (poäng) | tolkning + review | **endast approved** |
| familjevänlighet | ja | nej | nej | ja (poäng) | tolkning + review | **endast approved** |
| träningsbarhet | ja | nej | nej | ja (poäng) | tolkning + review | **endast approved** |
| allergivänlighet | ja | nej | ja (hypoallergenic) | ja | nej | utan review |
| rasgrupp | ja | nej | ja (group, ?include) | ja | nej | utan review |
| bilder | ja | nej | nej | ja (licens!) | licensgodkänd källa | **endast approved + licens** |
| valptips | ja | nej | nej | nej | AI-utkast + review | **endast approved** |
| vanliga saker att tänka på | ja | nej | nej | nej | AI-utkast + review | **endast approved** |
| hälsorisker | ja | nej | nej | ev. (vet-granskat, betald) | **källa + vet/SKK + approved** | **aldrig utan approved + källa** |
| källa (source) | ja | nej | n/a (sätts vid import) | n/a | n/a | metadata |
| licensnotering | ja | nej | n/a | n/a | n/a | metadata |
| attribution_required | ja | nej | n/a | n/a | n/a | metadata (visa attribution om true) |
| review_status | ja | nej | n/a | n/a | n/a | styr publicering |

*TheDogAPI endast om licens, pris, lagringsrätt, attribution och kommersiell
användning är kontrollerade. API Ninjas brett först efter bekräftad lagringsrätt.

## App-visningsregler

**Får visas utan mänsklig review** (objektiva faktafält med `source_verified`
från öppen/licensierad källa, normaliserade och rimlighetskontrollerade):
rasnamn, svensk rasnamnsvariant, livslängd, vikt, höjd, storlek, allergivänlighet,
rasgrupp.

**Får ALDRIG visas utan `review_status = approved`:**
all fritextsvenska (beskrivning, valptips, vanliga saker att tänka på), alla
tolkade/härledda egenskaper (aktivitetsnivå, pälsvård, familjevänlighet,
träningsbarhet), bilder (kräver även licensgodkännande), och **hälsorisker**
(kräver dessutom källhänvisning + vet/SKK-referens; aldrig AI-genererat fritt).

## AI:s roll i workflowet

- AI får: översätta EN->SV, sammanfatta källfält, skapa svenska utkast,
  normalisera namn, matcha raser mellan källor, flagga osäker data, härleda
  förslag (t.ex. aktivitetsnivå ur egenskapspoäng) med `derived_from`.
- AI får inte: vara faktakälla, hitta på hälsorisker, generera medicinska råd,
  publicera (allt blir `ai_draft`, aldrig `approved` utan människa).

## Luckor att åtgärda (utan att importa nu)

1. `breeds`-tabellen saknar kolumner för **vikt (kg)**, **höjd (cm)**, **rasgrupp**,
   **engelsk beskrivning**, samt råspårning. Designas i `breed_source_data` +
   tillägg, inte ad-hoc i `breeds`.
2. **Storlek** bör härledas deterministiskt ur vikt (dokumenterad tröskel) med
   `derived_from`, inte bara handsättas.
3. **Bilder** och **egenskaper** kräver licenskontroll (TheDogAPI/API Ninjas)
   innan lagring.
4. **Hälsa** är en egen, strängare pipeline med källa + review.

## Egna idéer (förslag)

- **`breed_field_registry`**: en tabell som per fält definierar källprecedens,
  visningsgrind (utan review / kräver approved), och om hälsogrind gäller. Gör
  reglerna datadrivna istället för hårdkodade i appen.
- **Deterministisk validator** för `source_verified`: range-/enum-kontroller
  (vikt > 0, livslängd rimlig, storlek i {liten,mellan,stor,varierar}) så
  faktafält kan publiceras utan manuell review men ändå kontrollerat.
- **Enhetsnormalisering vid import**: imperial -> kg/cm direkt, så appen alltid är
  metrisk och konsekvent.
- **Konfidens/osäkerhet per fält** (verified/derived/unverified) som metadata, så
  appen kan visa faktafält tryggt och hålla tolkade fält bakom review.

## Regler (denna fas)

Ingen databasändring, ingen import, ingen TheDogAPI-integration, ingen API-nyckel
i appen, ingen scraping, ingen commit/push utan godkännande.
