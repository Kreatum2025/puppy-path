# Partner- & intäktsstrategi (strategi, ingen implementation)

> Status: **strategi + struktur, inget byggt.** Ingen kod, ingen DB-ändring,
> ingen tracking-implementation, ingen AI-integration, ingen commit. Knyter till
> `docs/PRODUCT_MECHANICS.md` (produktkärna) och `docs/IMPLEMENTATION_PLAN.md`
> (content engine). Affärslagret läggs OVANPÅ produktresan, aldrig i vägen för den.

Inspiration: BabyJourney/Preglife - gratis för användaren, kommersiellt värdefull
för att innehåll, timing och målgrupp är precisa. PuppyJourney översätter det till
valpens **hemkomstfas** (`home_week_index`), **ålder** (`puppy_age_weeks`), ras
och region.

## Helhetsmodell (lager)

- **PuppyJourney core** = emotionell valpresa.
- **Content engine** = rätt godkänt innehåll i rätt fas.
- **Partner layer** = relevanta erbjudanden inbäddade som nytta.
- **Measurement layer** = bevis på räckvidd, timing och konvertering (aggregerat, GDPR-säkert).
- **Business model** = gratis app, B2B-finansierad.

Bärande princip: **bygg inte annonsytorna som reklam - bygg dem som hjälp i rätt
ögonblick.** Allt kommersiellt läggs ovanpå resan och får aldrig stå i vägen för
den eller låsa viktiga valpråd.

## 1. Affärsmodell

- **Gratis kärnapp.** Resan, korten, mål, milstolpar, minnen, rasnotiser och
  grundläggande valpråd är alltid gratis.
- **Partnerfinansierad** via relevanta B2B-partners (native partnerinnehåll,
  sponsrade checklistor/guider/poddar).
- **PuppyPass** - gratis förmånsprogram (se §4).
- **Ev. premium SENARE** (kurser, extra minnesbok, export, familjekonto) -
  **aldrig viktiga valpråd bakom betalvägg.** Detta är **inte klassisk freemium**;
  det är en partnerfinansierad gratisapp först, premium bara om det tillför värde
  utan att låsa kärnan.

## 2. Partner Journey Layer (per `home_week_index`)

Varje kommersiell yta kopplas till en fas i valpresan. Det ska kännas som "det
här behöver jag just nu", inte "annons".

| Fas | home_week | Användarbehov | Partnerkategorier | Naturliga erbjudanden | Risk/etisk gräns |
|---|---|---|---|---|---|
| Första veckan hemma | 1 | trygg start, basutrustning | försäkring, foder, hundbutik | trygg-start-checklista, valpförsäkring, valpfoder | ingen skrämselförsäljning; försäkring kräver juridik (§8) |
| Andra-fjärde veckan hemma | 2-4 | rumsrenhet, ensamhet, utrustning | valpkurs, utrustning, foder | valpkurs, sele/koppel/bädd | inga "måsten", lugn ton |
| Månad 2-3 hemma | ~5-13 | socialisering, träning, vaccin | träningsgodis, koppel, veterinär | träningsprodukter, veterinärpåminnelse | vaccin/hälsa = info, ej säljpush |
| Månad 4-6 hemma | ~14-26 | tandbyte, aktivering, foderbyte | aktivering, foder, vård | aktiveringsleksaker, foderuppföljning | inga hälsopåståenden utan källa |
| Unghundsfasen | ~27+ | fortsatt träning, vuxenfoder | foder, träning, försäkring | vuxenfoder, fortsättningskurs | relevans, ingen spam |

## 3. Partnerkategorier

hundförsäkring · hundfoder · veterinär/vård · hundbutik/utrustning ·
valpkurs/hundtränare · böcker/utbildning · podcast/sponsrat expertinnehåll.

Alla ska vara **relevanta och hjälpsamma** för fasen, aldrig påträngande.

## 4. PuppyPass (gratis förmånsprogram)

Inspirerat av Preglife "More" - **helt gratis**, ingen betalning, aktiveras snabbt.
Innehåll:
- valp-checklista (per fas),
- startpaket/rabatt via hundbutik,
- partnererbjudanden (foder, utrustning),
- ev. **gratis grundförmån via försäkringspartner** (KRÄVER juridisk kontroll, §8),
- valpkursinnehåll,
- **tydlig märkning** när något är sponsrat.

Förmåner är sponsrade av partners som betalar per aktivering/lead. Användaren ser
det som ett gratis mervärde, aldrig som dold reklam.

## 5. Native partner cards (föreslagen card_type)

Ny korttyp `partner_card` (sponsrat, alltid märkt, alltid kommersiellt granskat):

```json
{
  "card_type": "partner_card",
  "title": "Trygg start hemma",
  "short_body": "En enkel checklista för de första veckorna med valpen.",
  "optional_detail": "Längre guide bakom 'läs mer'.",
  "partner_type": "insurance",
  "sponsor_name": "Agria",
  "disclosure_label": "I samarbete med Agria",
  "home_week_range": [1, 2],
  "puppy_age_weeks_range": [8, 14],
  "breed_id": null,
  "placement": "weekly_flow",
  "cta_label": "Läs mer",
  "measurement_event_names": ["partner_card_viewed", "partner_cta_clicked"],
  "review_status": "approved",
  "commercial_review_status": "approved"
}
```

`commercial_review_status` är en **separat grind** (kommersiell/juridisk
granskning) utöver content-`review_status`. Båda måste vara `approved` innan ett
partner_card visas.

## 6. Annonsytor

**Tillåt:** checklistor, veckoflöde, läs-mer-artiklar, PuppyPass, poddkort,
utbildningsguider, relevanta påminnelser.

**Undvik:** popup-annonser, stressande banners, pressande push, dold reklam,
partnerinnehåll utan tydlig märkning, erbjudanden riktade olämpligt mot
barn/ungdomar.

## 7. Mätning (framtida eventnamn)

`weekly_card_viewed`, `daily_goal_completed`, `challenge_started`,
`challenge_completed`, `memory_saved`, `checklist_item_completed`,
`partner_card_viewed`, `partner_cta_clicked`, `puppypass_activated`,
`offer_activated`.

Underlag till partners (aggregerat, integritetssäkert): "Er guide visades för
3 200 valpägare i första-andra veckan hemma. CTR 4,1 %. 620 slutförde checklistan."
Ingen spårning byggs nu; detta definierar bara framtida event + att rapportering
ska vara aggregerad och GDPR-säker.

## 8. Etik och compliance (bindande)

- **Sponsrat innehåll ska ALLTID märkas** tydligt (`disclosure_label`).
- Partnerinnehåll ska vara **relevant och hjälpsamt** för fasen.
- **Extra försiktighet eftersom barn/ungdomar kan använda appen** - svensk tillsyn
  kring dold reklam/reklammärkning är aktiv, särskilt när barn/unga påverkas. Inga
  erbjudanden riktade på olämpligt sätt mot minderåriga.
- **Försäkringsförmedling får inte byggas utan juridisk kontroll** (ev. anknuten
  förmedlare-status, regelverk). Dokumenteras som möjlighet, inte byggs rakt in.
- **Ingen mörk gamification, ingen skuld/stress/FOMO.**
- **Aldrig viktiga valpråd bakom betalvägg.** Hälsa följer samma källa+approved-
  grind som i `docs/DATA_QUALITY_PLAN.md`.
- Persondata minimeras, samtycke, GDPR; segmentering sker aggregerat.

## 9. Podcast / contentkanal: "Valpsnack"

Framtida kanal:
- 10-15 min avsnitt,
- kopplade till veckoteman (t.ex. "Trygg socialisering i små steg"),
- sponsring endast när relevant och tydligt märkt,
- kan återanvändas som appkort (`podcast`-kort) och läs-mer-artiklar.

## Regler (denna fas)

Ingen kod, ingen DB-ändring, ingen tracking-implementation, ingen AI-integration,
ingen commit/push utan godkännande. Detta dokument styr framtida kommersiella
ytor så de byggs strukturerat och etiskt, inte ad-hoc.
