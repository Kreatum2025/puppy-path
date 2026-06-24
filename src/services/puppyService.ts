import type { Puppy } from '@/types';
import { mockPuppy } from '@/data/mockPuppy';

/**
 * Puppy data access.
 *
 * Prototype: returns mock data. Future: swap the body for a Supabase query,
 * e.g.
 *   const { data, error } = await supabase.from('puppies').select('*').single();
 *   if (error) throw error;
 *   return data;
 * The UI never changes because the signature stays the same.
 */
export async function getCurrentPuppy(): Promise<Puppy> {
  return mockPuppy;
}
