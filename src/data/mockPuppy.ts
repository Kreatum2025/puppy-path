import type { Puppy, GrowthLog } from '@/types';
import { subDays, toISODate } from '@/lib/dates';

/**
 * Mock puppy: Luna, a 12-week-old Golden Retriever.
 * Date of birth is computed relative to today so she stays 12 weeks old in the
 * prototype regardless of when it is run. Replaced by real data via Supabase
 * later — the UI only ever reads this through puppyService.
 */
const dateOfBirth = toISODate(subDays(new Date(), 12 * 7));

export const mockPuppy: Puppy = {
  id: 'puppy-luna',
  name: 'Luna',
  breedId: 'golden-retriever',
  breedName: 'Golden Retriever',
  dateOfBirth,
  homecomingDate: toISODate(subDays(new Date(), 7)), // came home ~1 week ago
  photoUri: null, // no bundled photo — UI renders a premium placeholder
  createdAt: dateOfBirth,
};

/** Latest growth reading shown on Today / profile. */
export const mockLatestGrowth: GrowthLog = {
  id: 'growth-latest',
  puppyId: mockPuppy.id,
  measuredAt: toISODate(subDays(new Date(), 2)),
  weightKg: 7.4,
  withersHeightCm: 32,
};

/** A short growth history (oldest → newest) for future charts. */
export const mockGrowthHistory: GrowthLog[] = [
  {
    id: 'growth-w9',
    puppyId: mockPuppy.id,
    measuredAt: toISODate(subDays(new Date(), 21)),
    weightKg: 4.6,
    withersHeightCm: 26,
  },
  {
    id: 'growth-w10',
    puppyId: mockPuppy.id,
    measuredAt: toISODate(subDays(new Date(), 14)),
    weightKg: 5.5,
    withersHeightCm: 28,
  },
  {
    id: 'growth-w11',
    puppyId: mockPuppy.id,
    measuredAt: toISODate(subDays(new Date(), 7)),
    weightKg: 6.5,
    withersHeightCm: 30,
  },
  mockLatestGrowth,
];
