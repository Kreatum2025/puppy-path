import type { BreedId } from '@/types';

/**
 * Statiskt demo-innehåll för hemskärmen (D2). Fokus: "Första veckan hemma"
 * (home_week_index = 1). Kurerat för demon, motsvarar docs/PRODUCT_MECHANICS.md.
 * Inget AI, ingen DB, ingen generering - rena exempel-kort.
 */
export interface HomeCard {
  title: string;
  body: string;
  cta?: string;
}

export const weeklyDevelopmentWeek1: HomeCard = {
  title: 'Den här veckan handlar om trygghet, vila och små rutiner',
  body: 'De första dagarna hemma är stora för en liten valp. Låt allt gå i lugn takt: korta stunder av lek och närhet, mycket sömn och förutsägbara rutiner ger trygghet.',
};

export const dailyGoalWeek1: HomeCard = {
  title: 'Sätt dig en stund på golvet nära valpen, utan krav.',
  body: 'Låt den komma till dig i sin egen takt.',
  cta: 'Markera som gjort',
};

export const reassuranceWeek1: HomeCard = {
  title: 'Det här är vanligt nu',
  body: 'Att valpen sover väldigt mycket, gnyr ibland eller är lite försiktig de första dagarna är helt normalt. Den landar i sitt nya hem.',
};

const GENERIC_BREED_NOTE: HomeCard = {
  title: 'Din rasnotis',
  body: 'Blandraser och unga valpar utvecklas olika. Vi använder ålder, vikt och dina sparade minnen för att göra resan mer personlig över tid.',
};

const BREED_NOTES: Partial<Record<BreedId, HomeCard>> = {
  'labrador-retriever': {
    title: 'Din rasnotis: Labrador',
    body: 'Labradorer är sociala och matglada. Första veckorna: håll lekstunderna korta och lugna, och låt vilan vara lika viktig som leken.',
  },
  dachshund: {
    title: 'Din rasnotis: Tax',
    body: 'Taxen är nyfiken och modig. Skydda ryggen genom att undvika höga hopp och trappor i början, och låt den utforska tryggt i egen takt.',
  },
  'border-collie': {
    title: 'Din rasnotis: Border Collie',
    body: 'Border collien är smart och vaken. Den första tiden behöver den framför allt lugn och vila. Mental stimulans i små, korta doser räcker långt.',
  },
};

export function breedNoteFor(breedId: BreedId | null | undefined): HomeCard {
  if (breedId && BREED_NOTES[breedId]) return BREED_NOTES[breedId] as HomeCard;
  return GENERIC_BREED_NOTE;
}

export interface HomeContent {
  weekly: HomeCard;
  dailyGoal: HomeCard | null;
  reassurance: HomeCard;
}

// Lugnt fallback för veckor bortom första veckan hemma. Demon fokuserar på den
// första tiden hemma; senare veckor byggs ut efter hand. Detta håller header
// och innehåll konsekventa (header säger aldrig "Andra veckan hemma" ovanför
// första-veckan-kort).
const laterWeeksContent: HomeContent = {
  weekly: {
    title: 'Din valpresa fortsätter',
    body: 'Vi bygger vidare på fler hemkomstveckor. I demon fokuserar vi först på den första tiden hemma.',
  },
  dailyGoal: {
    title: 'Ta en lugn stund tillsammans idag, helt utan krav.',
    body: 'Bara närvaro, inget att prestera.',
    cta: 'Markera som gjort',
  },
  reassurance: {
    title: 'Det här är vanligt nu',
    body: 'Varje valp utvecklas i sin egen takt. Lugn, rutiner och närhet är fortsatt det viktigaste.',
  },
};

/**
 * Hemskärmens innehåll för en given hemkomstvecka. Vecka 1 = det kurerade
 * första-veckan-innehållet; senare veckor får ett lugnt fallback tills de byggs
 * ut. Säkerställer att headern och korten alltid hör ihop.
 */
export function getHomeContentForWeek(homeWeekIndex: number): HomeContent {
  if (homeWeekIndex <= 1) {
    return {
      weekly: weeklyDevelopmentWeek1,
      dailyGoal: dailyGoalWeek1,
      reassurance: reassuranceWeek1,
    };
  }
  return laterWeeksContent;
}
