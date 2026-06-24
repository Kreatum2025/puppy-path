import type { Breed, BreedId } from '@/types';
import { breeds, breedNameById as lookupBreedName } from '@/data/breeds';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Breed reference data.
 *
 * Reads from Supabase (`breeds`, public read-only) when configured, and falls
 * back to the local MVP list when Supabase is absent or a query fails — so the
 * app runs identically with or without a backend. This service is the single
 * seam between the UI and the data source; the UI never changes regardless of
 * where breeds come from. See docs/SUPABASE_PLAN.md.
 */
export async function getBreeds(): Promise<Breed[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('breeds')
        .select('id, name_sv')
        .order('name_sv');
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((row) => ({
          id: row.id as BreedId,
          name: row.name_sv as string,
        }));
      }
    } catch {
      // Fall through to local mock data below.
    }
  }
  return breeds;
}

/** Display name for a breed id (sync lookup over the local reference list). */
export function breedNameById(id: string): string {
  return lookupBreedName(id);
}
