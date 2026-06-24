import type { Breed } from '@/types';
import { breeds, breedNameById as lookupBreedName } from '@/data/breeds';

/**
 * Breed reference data.
 *
 * Prototype: returns the local MVP list. Future: this is where breed data from
 * an external source/API (see docs/BREED_DATA.md) gets wired in, without
 * changing the UI. Screens read breeds through this service, never from
 * `src/data` directly.
 */
export async function getBreeds(): Promise<Breed[]> {
  return breeds;
}

/** Display name for a breed id (sync lookup over the reference list). */
export function breedNameById(id: string): string {
  return lookupBreedName(id);
}
