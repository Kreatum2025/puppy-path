# PuppyJourney produktmekanik (plan, ingen kod)

> Status: **plan, inget byggt.** Ingen kod, ingen DB-ändring, ingen AI-integration,
> ingen commit. Detta är produktkärnan; rasdata och AI är stödsystem.

## Core product feeling

PuppyJourney ska kännas som att användaren **bygger sin valps livsresa** - inte
som en faktadatabas, inte som en AI-chatbot, inte bara loggning. Varje vecka ska
kännas som ett nytt steg. Engagemanget ska vara **varmt, emotionellt belönande
och återkommande utan manipulation**. Målgruppen kan vara barn/tonåringar och
vuxna, så vi är extra försiktiga med gamification.

Tre lager samtidigt:
1. **Resan** - ålder, utvecklingsfas, milstolpar, minnen.
2. **Guidningen** - kort, korrekt, pedagogisk info vid rätt tillfälle.
3. **Belöningen** - mål, mjuka utmaningar, progress, badges, minneskort.

Fel väg: långa artiklar om ras/skötsel/träning. Rätt väg: **ett kort i taget -
rätt info just nu - tydligt litet mål - liten handling - mjuk belöning - sparat
minne.**

## Terminologi & tidsfält (bindande)

Appen börjar vid **hemkomst**, inte vid födsel. De flesta hämtar hem valpen vid
~8-12 veckors biologisk ålder; vecka 1-8 är valpen normalt hos tik/kull (näring,
närhet, hundspråk, lek, gränser och samspel med kullen). Därför får **"Vecka 1" aldrig användas
som fristående UI-begrepp** (förväxlas med biologisk levnadsvecka 1).

**Två tidsfält:**
- `home_week_index` - veckor sedan hemkomst. Styr den **emotionella resan**: mål,
  utmaningar, checklistor, milstolpar, minnen, partnererbjudanden.
- `puppy_age_weeks` - biologisk ålder. Styr **kunskap**: utvecklingsinformation,
  träningsnivå, ras-/åldersråd, försiktighetskort.

**Primär journey-copy (använd dessa):** "Första veckan hemma", "Andra veckan
hemma", "Tredje veckan hemma", "Första månaden tillsammans", "Månad 2 hemma",
"Månad 3 hemma", "Unghundsfasen".

**Undvik:** "Vecka 1", "Valpens första vecka", "Dag 4 med Luna", dagbaserad
huvudmekanik.

**Tillåtet endast om tydligt förklarat:** "Vecka 1 hemma", "valpens biologiska
ålder: 10 veckor", "Luna är 10 veckor".

**UI-exempel:** "Luna är 10 veckor" · "Första veckan hemma" · "Den här veckan
handlar om trygghet, vila och små rutiner".

Regel: biologisk ålder = kunskapsmotor; hemkomstveckor = emotionell appresa.

## Onboarding-kort: "Innan valpen kom hem till dig"

När användaren skapat konto och angett att valpen är ~8-12 veckor visas ett varmt,
pedagogiskt kort som förklarar varför resan börjar vid **hemkomst** (inte födsel),
och överbryggar "första tiden hos mamma/kull" → "livet hemma hos dig". Det
hindrar att biologisk vecka 8-12 förväxlas med "första veckan hemma". Särskilt
onboarding-kort, inte en vanlig artikel.

```json
{
  "card_type": "onboarding_info",
  "placement": "after_puppy_age_input",
  "shown_when": "puppy_age_weeks between 8 and 12",
  "title": "Innan valpen kom hem till dig",
  "body": "Din valp har redan varit med om sin första viktiga resa. De första veckorna har den fått vara nära sin mamma och sina kullsyskon. Där har valpen fått näring, värme och trygghet, men också börjat lära sig hundspråk, lek, gränser och hur man är tillsammans med andra.\n\nNu börjar nästa stora steg: livet hemma hos dig.\n\nDen första tiden handlar inte om att göra allt perfekt. Det viktigaste är trygghet, vila, små rutiner och att ni får lära känna varandra i lugn takt.",
  "emotional_tone": "reassuring",
  "review_status": "draft"
}
```

Enkelt språk för barn, ungdomar och vuxna. Ingen "korrigering"-jargong i texten.

## Mekaniklager

- **Journey/timeline** - valpens första tid hemma, vecka för vecka, från hemkomst till unghundsfas.
- **Weekly themes** - varje vecka ett tema: trygghet, rutiner, socialisering,
  vila, ensamhet, vardagsträning.
- **Daily goals** - små uppgifter som känns enkla att klara.
- **Challenges** - mjuka uppdrag, inte tävling: "3 lugna hanteringsstunder denna vecka".
- **Milestones** - första promenaden, första natten, första kloklippningen, första trygga ensamstunden.
- **Memories** - foto, anteckning, "idag lärde sig min valp...".
- **Progress** - resa, inte prestationsscore: "2 av 5 veckomål klara".
- **Breed-specific notes** - små personliga kort beroende på ras.
- **Reassurance cards** - "det här är vanligt i den här fasen".
- **Log prompts** - sömn, mat, rumsrenhet, humör, träning, socialisering.

## Content card-principer

Varje kort har:
```
card_type        // weekly_development | daily_goal | challenge | milestone | memory_prompt | reassurance | breed_note | log_prompt | onboarding_info
title
short_body       // kort, luftig text
optional_detail  // för "läs mer", visas inte i huvudflödet
action_label     // tydlig CTA
reward_text      // mjuk, positiv belöning (valfri)
home_week_index  // veckor sedan hemkomst (emotionell resa)
puppy_age_weeks  // biologisk ålder (kunskap/utveckling)
breed_id         // valfri (null = global per stage)
emotional_tone   // warm_clear | reassuring | encouraging | celebratory
review_status    // draft | approved ...
```

## Språk (bindande)

Enkelt, pedagogiskt språk som alla förstår oavsett målgrupp - men utgå från att
**barn och ungdomar ofta använder appen mest**. Korta meningar, vardagliga ord,
inga facktermer i huvudflödet (förklaras vid "läs mer"), uppmuntrande och tryggt.
Aldrig skuldbeläggande. Samma text ska funka för en 11-åring och en vuxen.

## Layoutprincip

- **Ett huvudkort åt gången**, max 2-3 sekundära kort.
- Kort text, mycket luft, tydlig CTA, mjuka animationer.
- Progress visuellt men **inte stressande**.
- "Läs mer" för fördjupning - **inga långa textblock i huvudflödet**.
- Enkelt språk för både barn/tonåringar och vuxna; tunga veterinärtexter ligger
  bakom "läs mer", aldrig i huvudflödet.

## Mjuk gamification

**Tillåt:** veckomål, små utmaningar, minnen, badges/milstolpar, progress
("2 av 5 mål klara"), positiv feedback.

**Undvik (särskilt med barn/tonåringar):** straff, pressande streaks, skuld,
stress, tävlingshets, manipulativa dopaminloopar. Att missa en dag ska aldrig
kännas som ett misslyckande - resan fortsätter lugnt.

## AI-roll

AI hjälper till att skapa **strukturerade draft-kort** från: rasdata (fact brief),
valpens ålder, contentregler, godkända källor och PuppyJourney-ton. AI:n:
- får skapa utkast (`review_status: draft`),
- får aldrig publicera automatiskt,
- får aldrig hitta på hälsopåståenden.

Appen visar **bara `approved` content**. (Se docs/AI_WORKFLOW.md,
docs/IMPLEMENTATION_PLAN.md.)

## Första exempel: första veckan hemma (~10 veckor) (draft-kort)

Första veckan hemma (valpen är ~10 veckor), tema: **trygghet, vila och små rutiner.** Globala kort (breed_id null)
delas av alla raser; `breed_note` är rasspecifik.

```json
[
  { "card_type": "weekly_development", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": null,
    "title": "Första veckan hemma: trygghet och små rutiner",
    "short_body": "Den här veckan handlar mycket om trygghet, vila och korta, lugna rutiner.",
    "optional_detail": "Korta pass fungerar bättre än långa. Mycket sömn är helt normalt.",
    "action_label": "Läs mer", "reward_text": null,
    "emotional_tone": "reassuring", "review_status": "draft" },

  { "card_type": "daily_goal", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": null,
    "title": "Dagens lilla mål",
    "short_body": "Träna inkallning tre korta gånger inomhus, max 2 minuter per gång.",
    "action_label": "Markera som gjort",
    "reward_text": "Ett steg framåt i valpens första träningsvecka.",
    "emotional_tone": "warm_clear", "review_status": "draft" },

  { "card_type": "challenge", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": null,
    "title": "Veckans mjuka utmaning",
    "short_body": "Tre lugna hanteringsstunder den här veckan: tassar, öron, päls.",
    "action_label": "Logga en stund",
    "reward_text": "Din valp lär sig att hantering är tryggt.",
    "emotional_tone": "encouraging", "review_status": "draft" },

  { "card_type": "milestone", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": null,
    "title": "Milstolpe att sikta på",
    "short_body": "Första trygga ensamstunden, några minuter själv utan oro.",
    "action_label": "Spara som milstolpe",
    "reward_text": "En stor liten seger på resan.",
    "emotional_tone": "celebratory", "review_status": "draft" },

  { "card_type": "memory_prompt", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": null,
    "title": "Veckans minne",
    "short_body": "Ta en bild eller skriv: idag lärde sig min valp...",
    "action_label": "Spara minne",
    "reward_text": "Ännu ett minne i valpens livsresa.",
    "emotional_tone": "warm_clear", "review_status": "draft" },

  { "card_type": "reassurance", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": null,
    "title": "Det här är vanligt nu",
    "short_body": "Mer bitande och korta kaosstunder hör till. Ofta handlar det om trötthet.",
    "action_label": "Läs mer",
    "emotional_tone": "reassuring", "review_status": "draft" },

  { "card_type": "breed_note", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": "labrador-retriever",
    "title": "Din labrador den här veckan",
    "short_body": "Labradorer är ofta matglada och energiska. Korta, lugna pass passar bättre än långa.",
    "action_label": "Läs mer", "reward_text": null,
    "emotional_tone": "warm_clear", "review_status": "draft",
    "source_ids": ["dogapi.dog:labrador-retriever"] },

  { "card_type": "breed_note", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": "dachshund",
    "title": "Din tax den här veckan",
    "short_body": "Taxar är nyfikna och självständiga. Håll träningen kort, rolig och tålmodig.",
    "action_label": "Läs mer", "reward_text": null,
    "emotional_tone": "warm_clear", "review_status": "draft",
    "source_ids": ["dogapi.dog:dachshund"] },

  { "card_type": "breed_note", "home_week_index": 1, "puppy_age_weeks": 10, "breed_id": "border-collie",
    "title": "Din border collie den här veckan",
    "short_body": "Border collies lär sig snabbt och gillar mental stimulans. Korta tankenötter passar bra.",
    "action_label": "Läs mer", "reward_text": null,
    "emotional_tone": "warm_clear", "review_status": "draft",
    "source_ids": ["dogapi.dog:border-collie"] }
]
```

Alla exempel ovan är **draft** och illustrerar formatet/tonen. Inget publiceras
utan mänsklig `approved`. Inga hälsopåståenden - korten beskriver beteende/rutiner,
inte sjukdom.

## Inspiration & tillägg (BabyJourney/Preglife)

Från analysen av BabyJourney/Preglife (Nordens ledande gravidappar), anpassat
med våra skyddsräcken:

- **Kronologisk resa, längre horisont:** från hemkomst → unghundsfas (~2 år).
  Veckovis upplåsning, men lugnt - inget FOMO.
- **Onboarding-personalisering:** fråga ras, kön, hemkomstdatum (+ födelsedatum
  om känt, annars uppskattad ålder), om det finns barn/andra djur. Innehåll och rasnotiser anpassas så appen känns som att
  den "vet vem man är". Persondata minimeras och samlas med samtycke (se
  `docs/BUSINESS_MODEL.md`, integritet).
- **Expertverifierat innehåll = förtroende:** kärninnehåll skapas/granskas av
  legitimerad veterinär/etolog/hundtränare, med synligt namn + titel ("Granskat
  av leg. veterinär ..."). Knyter till `review_status = approved` + hälsogrinden.
- **Community - "Valptempen":** mjuk daglig/veckovis fråga bland alla med valp i
  samma ålder/ras ("Hur sov valpen i natt?"). Minskar ensamhetskänsla. Frivilligt,
  modererat, ingen press - extra försiktigt eftersom barn/tonåringar kan delta.
- **Storytelling:** korta, äkta valpberättelser från samma vecka man är i. Skapar
  igenkänning. Med samtycke, granskat.
- **Veckovis push:** en personlig, tidsstyrd notis per vecka ("Första tiden
  hemma - trygg socialisering i små steg"). Lugn ton, ej spammande, lätt att stänga av.
- **AI "Puppy Coach" (senare, nivå 3):** veterinär-tränad, inbäddad - men enligt
  `docs/AI_WORKFLOW.md`: bara godkänd kunskapsbas, symptom → veterinär, aldrig
  fri diagnos. Byggs sist.
- **"Läs mer" för djup:** tunga veterinär-/etolog-texter bakom "läs mer", aldrig
  i huvudflödet.

Allt följer kärnregeln: varmt, icke-manipulativt, tryggt - inga mörka mönster,
särskilt med tanke på yngre användare.

## Regler (denna fas)

Ingen kod, ingen databasändring, ingen AI-integration, ingen commit/push utan
godkännande. Detta dokument är huvudriktningen; rasdata och AI är stöd.
