import type { WeeklyGuide } from '@/types';

/** Shown on every week card. Calm, non-veterinary, honest. */
export const SAFETY_DISCLAIMER =
  'Detta är generell information och ersätter inte veterinär eller hundtränare. Kontakta veterinär vid oro eller försämrat allmäntillstånd.';

/**
 * Editorial week content for weeks 8–16 (the MVP range with full content).
 * Weeks 17–52 are produced as "coming soon" placeholders by journeyService,
 * so we keep this file small.
 */
export const weeklyGuides: WeeklyGuide[] = [
  {
    weekNumber: 8,
    title: 'Första tiden hemma',
    summary:
      'Vecka 8 handlar om trygghet. Valpen lär känna sitt nya hem, sina människor och en lugn dygnsrytm.',
    bodyBrain:
      'Allt är nytt. Valpen tar in dofter, ljud och rum i små doser. Mycket sömn är helt normalt och viktigt för utvecklingen.',
    behaviorNote:
      'Gnäll, oro vid ensamhet och kissolyckor hör till. Det handlar om anpassning, inte om att något är fel.',
    focusPoints: ['Trygg start', 'Lugn dygnsrytm', 'Korta positiva stunder'],
    checklist: [
      'Skapa en lugn viloplats',
      'Logga vikt',
      'Lägg till första bilden',
      'Håll utevistelser korta',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 9,
    title: 'Trygghet och rutiner',
    summary:
      'Vecka 9 bygger vidare på trygghet. Förutsägbara rutiner gör världen begriplig för valpen.',
    bodyBrain:
      'Valpen börjar koppla händelser till rutiner: mat, vila, utgång. Repetition skapar trygghet.',
    behaviorNote:
      'Valpen kan vara försiktig eller väldigt nyfiken. Båda är okej. Låt valpen utforska i egen takt.',
    focusPoints: ['Fasta rutiner', 'Positiv koppling till hemmet', 'Vila efter aktivitet'],
    checklist: [
      'Håll fasta mat- och vilotider',
      'Logga vikt',
      'Lägg till veckans bild',
      'Öva korta avsked',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 10,
    title: 'Nyfikenhet vaknar',
    summary:
      'Vecka 10 blir många valpar modigare och vill utforska mer. Nya intryck behöver doseras lugnt.',
    bodyBrain:
      'Hjärnan tar in mycket. Korta, positiva möten med vardagsmiljöer lägger en bra grund.',
    behaviorNote:
      'Mer tuggande och utforskande med munnen är vanligt. Erbjud lämpliga saker att tugga på.',
    focusPoints: ['Korta miljöpass', 'Positiva nya intryck', 'Gott om vila'],
    checklist: [
      'Ett nytt lugnt intryck i taget',
      'Logga vikt',
      'Lägg till veckans bild',
      'Erbjud något tillåtet att tugga på',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 11,
    title: 'Mer mod, mer vila',
    summary:
      'Vecka 11 pendlar valpen ofta mellan stora upptäckter och stort sömnbehov.',
    bodyBrain:
      'Inlärningen går snabbt men energin tar slut fort. Korta pass fungerar bättre än långa.',
    behaviorNote:
      'Småkaos och översvall betyder ofta trötthet. En lugn paus hjälper mer än mer aktivitet.',
    focusPoints: ['Korta träningspass', 'Tydliga vilopauser', 'Lugn hantering'],
    checklist: [
      'Träna 2–3 minuter i taget',
      'Logga vikt',
      'Lägg till veckans bild',
      'Lägg in tydliga sovpauser',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 12,
    title: 'Nyfiken, bitig och snabbt växande',
    summary:
      'I vecka 12 är många valpar mer modiga, mer nyfikna och mer intensiva. Det är vanligt med mer bitande, kort koncentration och stort behov av vila.',
    bodyBrain:
      'Hjärnan utvecklas snabbt och valpen testar världen med munnen, nosen och kroppen. Korta, lugna pass fungerar bättre än långa träningsstunder.',
    behaviorNote:
      'Bitande, hoppande och små kaosstunder betyder inte att något är fel. Ofta handlar det om trötthet, överslag eller behov av tydligare rutiner.',
    focusPoints: ['Korta miljöpass', 'Fortsatt rumsrenhet', 'Lugn hantering och vila'],
    checklist: [
      'Logga vikt',
      'Lägg till veckans bild',
      'Träna 2–3 minuter ensamhet',
      'Klipp eller rör vid klor försiktigt',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 13,
    title: 'Rutiner som sätter sig',
    summary:
      'Vecka 13 börjar tidigare träning ge frukt. Tålamod och upprepning är fortfarande nyckeln.',
    bodyBrain:
      'Valpen kan hålla fokus något längre, men behöver fortfarande mycket vila mellan passen.',
    behaviorNote:
      'Testande beteende kan dyka upp. Var lugn och konsekvent snarare än sträng.',
    focusPoints: ['Konsekventa rutiner', 'Lugn vid hantering', 'Positiv förstärkning'],
    checklist: [
      'Upprepa korta träningsmoment',
      'Logga vikt',
      'Lägg till veckans bild',
      'Öva lugn hantering av tassar och öron',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 14,
    title: 'Sociala intryck',
    summary:
      'Vecka 14 är fortsatt en bra tid för lugna, positiva möten med vardagens ljud och miljöer.',
    bodyBrain:
      'Positiva erfarenheter nu lägger grunden för en trygg vuxen hund. Kvalitet före kvantitet.',
    behaviorNote:
      'Om valpen drar sig undan, sänk tempot. Trygghet byggs i valpens egen takt.',
    focusPoints: ['Lugna nya miljöer', 'Positiva möten', 'Vila efteråt'],
    checklist: [
      'Ett nytt lugnt intryck i taget',
      'Logga vikt',
      'Lägg till veckans bild',
      'Låt valpen utforska i egen takt',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 15,
    title: 'Energi och fokus',
    summary:
      'Vecka 15 har många valpar mer energi. Struktur och vila hjälper den att landa.',
    bodyBrain:
      'Förmågan att lära ökar, men impulskontroll är fortfarande under utveckling.',
    behaviorNote:
      'Uppe i varv-stunder är normala. Förebygg med vila innan valpen blir övertrött.',
    focusPoints: ['Förutsägbar struktur', 'Korta aktiva pass', 'Planerad vila'],
    checklist: [
      'Planera in vila före överstimulering',
      'Logga vikt',
      'Lägg till veckans bild',
      'Träna korta, roliga moment',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
  {
    weekNumber: 16,
    title: 'En liten hund tar form',
    summary:
      'Vecka 16 börjar valpens personlighet synas tydligare. Fortsätt med lugn, konsekvent vägledning.',
    bodyBrain:
      'Mycket av grunden för trygghet och rutiner är på plats. Bygg vidare i lugn takt.',
    behaviorNote:
      'Fortsatt testande är normalt. Tydlighet och tålamod ger mest på sikt.',
    focusPoints: ['Fortsatt rumsrenhet', 'Lugn ensamträning', 'Konsekvens'],
    checklist: [
      'Bygg vidare på ensamträning',
      'Logga vikt',
      'Lägg till veckans bild',
      'Håll rutiner konsekventa',
      'Belöna lugnt beteende',
    ],
    disclaimer: SAFETY_DISCLAIMER,
    available: true,
  },
];
