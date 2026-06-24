import type { Challenge } from '@/types';
import { mockPuppy } from './mockPuppy';
import { subDays, toISODate } from '@/lib/dates';

/** Recent challenges Luna's owner is working through. */
export const mockChallenges: Challenge[] = [
  {
    id: 'ch-1',
    puppyId: mockPuppy.id,
    title: 'Biter på allt',
    weekNumber: 12,
    loggedAt: toISODate(subDays(new Date(), 1)),
    icon: '🦴',
  },
  {
    id: 'ch-2',
    puppyId: mockPuppy.id,
    title: 'Drar i kopplet',
    weekNumber: 11,
    loggedAt: toISODate(subDays(new Date(), 6)),
    icon: '🐾',
  },
];

/** Suggestable weekly challenges for the "Utmaning"-action. */
export const suggestedChallenges: string[] = [
  'Biter på allt',
  'Drar i kopplet',
  'Svårt att vara ensam',
  'Vaknar tidigt',
  'Hoppar på besök',
  'Äter saker ute',
];
