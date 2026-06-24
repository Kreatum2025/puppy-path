# Rasanpassad profil och rasdata (design / backlog)

> Status: **vision, ej byggd.** Bygger additivt på befintlig arkitektur
> (`Breed`/`breedId` finns redan i `src/types/puppy.ts`). Ingen kod ännu.

## Idé

När en användare väljer ras ska kontot anpassas efter just den rasen. Exempel:
"Atlas är en Rottweiler" → profilen visar en lugn, pedagogisk
**rasbeskrivning** och rasens typiska **egenskaper och beteenden**, så att ägaren
lär sig vad som är normalt för sin valp. På sikt ska även **veckoutvecklingen**
nyanseras per ras (t.ex. storras vs dvärgras: tillväxttakt, aktivitetsbehov,
mognad), utan att bryta den lugna tonen eller göra veterinära påståenden.

Mål: gör appen mer personlig och lärande från dag ett, inte en generisk hundguide.

## Värdeprincip

- Beskrivande, inte dömande. Vi beskriver rastypiska tendenser, vi varnar inte.
- Inga veterinära eller medicinska påståenden (samma regel som veckoguiderna).
- Rasinfo kompletterar den personliga resan, den ersätter den inte. Användarens
  egen loggdata är fortfarande huvudpersonen.
- Honest data: visa bara rasinfo vi faktiskt har. Saknas den för en ras
  (t.ex. Blandras) → ärligt, varmt tomt-state, aldrig påhittat innehåll.

## Datamodell (föreslagen utökning)

Utöka `Breed` (eller lägg ett separat `BreedProfile`) additivt:

```ts
interface BreedProfile {
  id: BreedId;
  name: string;
  group?: string;            // t.ex. "Brukshund", "Sällskapshund"
  sizeClass?: 'liten' | 'mellan' | 'stor';
  shortDescription: string;  // 1-2 meningar, lugn ton
  temperament: string[];     // t.ex. ["lugn", "vaksam", "lojal"]
  activityNeed?: 'låg' | 'medel' | 'hög';
  goodToKnow?: string[];     // rastypiska saker att förbereda sig på
  sourceName?: string;       // varifrån informationen kommer (transparens)
  sourceUrl?: string;
}
```

Konsumeras via service-lagret som allt annat:

```ts
// src/services/breedService.ts
export async function getBreedProfile(id: BreedId): Promise<BreedProfile | null>;
```

Mock nu, riktig källa/API senare. UI ändras inte vid bytet.

## Innehållsstruktur (inspirerad av SKK)

SKK har en tydlig och igenkännbar struktur per ras att ta inspiration ifrån:

- Kort rasbeskrivning / historik
- Egenskaper och mentalitet (temperament)
- Aktivitets- och sysselsättningsbehov
- Storlek och allmänt om rasen
- "Bra att veta" inför valptiden

Vi återanvänder strukturen men skriver **egen, kort, lugn copy** (ingen
direktkopiering av text). Visa alltid källa transparent (`sourceName`/`sourceUrl`).

## Var det syns i appen

- **Min valp**: ett "Om rasen"-kort (beskrivning + 3-4 egenskaper + aktivitetsnivå).
- **Resan**: liten rasnyans i veckokorten där det är relevant och säkert
  (t.ex. storras: "växer snabbt, undvik hård motion tidigt" som lugn notis).
- **Onboarding (rasval)**: en kort förhandsvisning av rasen direkt vid valet,
  som en liten belöning ("Vad kul, en Rottweiler!").

## Möjliga datakällor (att utvärdera)

- **SKK** (svenska kennelklubben): bäst struktur och svensk kontext. Oklart
  öppet API; kan kräva manuell kuratering eller licens. Använd som
  struktur-/kvalitetsreferens.
- **The Dog API** (`thedogapi.com`, `api.thedogapi.com`): öppet API med
  rasdata (temperament, vikt, höjd, livslängd, bild). Engelskt → kräver
  översättning/kuratering till svensk ton. **Trolig kandidat för det API
  användaren mindes.**
- **Wikidata / Wikipedia**: brett men ostrukturerat; endast som komplement.

Verifiera licens och täckning (svenska raser + Blandras) innan val. Börja
sannolikt med en liten, handkurerad svensk mock för MVP-raserna, lägg API
ovanpå senare.

## Fasning

1. Lägg `BreedProfile`-typ + `breedService` med handkurerad mock för de 10
   MVP-raserna (kort beskrivning + 3 egenskaper + aktivitetsnivå).
2. "Om rasen"-kort på Min valp + förhandsvisning i rasvalet.
3. Rasnyans i veckokort där det är säkert och relevant.
4. Koppla extern källa/API, behåll svensk kuratering och källangivelse.

## Gränser

- Ingen rasprofilering som låter dömande eller skrämmande.
- Inga hälsopåståenden om enskilda raser.
- Blandras och raser utan data → ärligt tomt-state, inte gissningar.
