import type { GuideCategory } from '@/types';

/** Guide hub categories (cards only — no full article library yet). */
export const guideCategories: GuideCategory[] = [
  {
    id: 'first-week',
    title: 'Första veckan hemma',
    description: 'En lugn start för dig och din valp.',
    icon: 'home-outline',
  },
  {
    id: 'house-training',
    title: 'Rumsrenhet',
    description: 'Tålamod, rutiner och små framsteg.',
    icon: 'water-outline',
  },
  {
    id: 'alone-training',
    title: 'Ensamträning',
    description: 'Bygg trygghet i korta steg.',
    icon: 'time-outline',
  },
  {
    id: 'socialisation',
    title: 'Socialisering',
    description: 'Positiva möten i valpens egen takt.',
    icon: 'people-outline',
  },
  {
    id: 'biting',
    title: 'Bitande',
    description: 'Förstå och styra om valpbett.',
    icon: 'paw-outline',
  },
  {
    id: 'sleep',
    title: 'Sömn och vila',
    description: 'Vila är en del av utvecklingen.',
    icon: 'moon-outline',
  },
  {
    id: 'food',
    title: 'Foder och mage',
    description: 'Lugn rutin kring mat och matsmältning.',
    icon: 'nutrition-outline',
  },
  {
    id: 'handling',
    title: 'Hantering och kloklippning',
    description: 'Gör beröring tryggt och positivt.',
    icon: 'cut-outline',
  },
];
