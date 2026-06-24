import type { Milestone } from '@/types';
import { mockPuppy } from './mockPuppy';
import { subDays, toISODate } from '@/lib/dates';

/** Recent milestones for Luna (newest first when sorted by service). */
export const mockMilestones: Milestone[] = [
  {
    id: 'ms-1',
    puppyId: mockPuppy.id,
    title: 'Sov hela natten',
    weekNumber: 12,
    achievedAt: toISODate(subDays(new Date(), 1)),
    icon: '🌙',
  },
  {
    id: 'ms-2',
    puppyId: mockPuppy.id,
    title: 'Första lugna bilturen',
    weekNumber: 11,
    achievedAt: toISODate(subDays(new Date(), 8)),
    icon: '🚗',
  },
  {
    id: 'ms-3',
    puppyId: mockPuppy.id,
    title: 'Kom när jag ropade',
    weekNumber: 10,
    achievedAt: toISODate(subDays(new Date(), 15)),
    icon: '✨',
  },
];

/** A small library of suggestable milestones for the "Milstolpe"-action. */
export const suggestedMilestones: string[] = [
  'Sov hela natten',
  'Första gången ensam hemma',
  'Mötte en ny hund lugnt',
  'Klarade trappan själv',
  'Kom när jag ropade',
  'Lugn vid kloklippning',
];
