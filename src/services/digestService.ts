import type { WeeklyDigest } from '@/types';
import { mockPuppy } from '@/data/mockPuppy';

/**
 * AI Weekly Digest.
 *
 * PLACEHOLDER ONLY. No real AI calls in this prototype. Later this will call a
 * backend function that summarises the owner's own logged data for the week.
 * `generated` stays false until that exists, so the UI can show an honest
 * "kommer snart"-style placeholder rather than a fake AI result.
 */
export async function getWeeklyDigest(
  weekNumber: number,
): Promise<WeeklyDigest> {
  return {
    id: `digest-w${weekNumber}`,
    puppyId: mockPuppy.id,
    weekNumber,
    caption:
      'När du börjar logga vikt, bilder, milstolpar och utmaningar kan PuppyJourney skapa en personlig sammanfattning av din valps vecka.',
    generated: false,
  };
}
