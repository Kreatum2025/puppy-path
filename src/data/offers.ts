import type { NativeOffer } from '@/types';

/**
 * Lifecycle-based recommendation placeholders. These are examples only — no
 * real affiliate links. Clearly marked as "Partnerplats – exempel" in the UI.
 */
export const nativeOffers: NativeOffer[] = [
  {
    id: 'offer-start',
    category: 'Valpstart',
    title: 'Allt inför första tiden',
    description: 'Checklistor och basutrustning för en trygg start.',
    relevantWeeks: [8, 12],
    icon: 'basket-outline',
  },
  {
    id: 'offer-training',
    category: 'Träning',
    title: 'Valpkurs nära dig',
    description: 'Lugn, positiv träning anpassad för valpens ålder.',
    relevantWeeks: [10, 20],
    icon: 'school-outline',
  },
  {
    id: 'offer-food',
    category: 'Foder',
    title: 'Foder för växande valpar',
    description: 'Näring anpassad efter ras och tillväxt.',
    relevantWeeks: [8, 52],
    icon: 'restaurant-outline',
  },
  {
    id: 'offer-insurance',
    category: 'Försäkring',
    title: 'Trygghet om något händer',
    description: 'Jämför valpförsäkringar i lugn och ro.',
    relevantWeeks: [8, 16],
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'offer-gear',
    category: 'Utrustning',
    title: 'Sele, koppel och bädd',
    description: 'Säkra produkter som växer med valpen.',
    relevantWeeks: [9, 24],
    icon: 'walk-outline',
  },
  {
    id: 'offer-memorybook',
    category: 'Minnesbok',
    title: 'Spara första året',
    description: 'Gör en fin minnesbok av valpens resa.',
    relevantWeeks: [8, 52],
    icon: 'book-outline',
  },
];

/** The single subtle "Relevant denna vecka" slot shown on Today. */
export const weeklyPartnerExample = {
  title: 'Relevant denna vecka',
  body:
    'Vecka 10–14: många valpar börjar bita mer. Här kan framtida partnererbjudanden för säkra tuggprodukter, valpkurs eller valpsele visas.',
  label: 'Partnerplats – exempel',
};
