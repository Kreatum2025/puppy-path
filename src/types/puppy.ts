/**
 * Core puppy domain types.
 * These mirror the shape of future database tables (Supabase) so the UI and
 * service layer never need to change when the backend is connected.
 */

export type BreedId =
  | 'labrador-retriever'
  | 'golden-retriever'
  | 'german-shepherd'
  | 'french-bulldog'
  | 'cocker-spaniel'
  | 'border-collie'
  | 'dachshund'
  | 'poodle'
  | 'cavalier-king-charles-spaniel'
  | 'mixed';

export interface Breed {
  id: BreedId;
  /** Display name (Swedish UI). */
  name: string;
}

/** Future table: puppies */
export interface Puppy {
  id: string;
  name: string;
  breedId: BreedId;
  breedName: string;
  /** Biological date of birth, ISO (yyyy-mm-dd). Drives puppy_age_weeks. */
  dateOfBirth: string;
  /** ISO date the puppy came home. Drives home_week_index (emotional journey). */
  homecomingDate?: string | null;
  /** Local URI / remote URL of the profile photo, or null if not set yet. */
  photoUri: string | null;
  createdAt: string;
}

/** Future table: growth_logs */
export interface GrowthLog {
  id: string;
  puppyId: string;
  /** ISO datetime. */
  measuredAt: string;
  /** Body weight in kilograms. */
  weightKg: number | null;
  /** Withers height (mankhöjd) in centimetres. */
  withersHeightCm: number | null;
}
