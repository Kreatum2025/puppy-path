import type { Milestone } from '@/types';
import { mockMilestones, suggestedMilestones } from '@/data/milestones';

/** Recent milestones, newest first. */
export async function getRecentMilestones(): Promise<Milestone[]> {
  return [...mockMilestones].sort((a, b) =>
    b.achievedAt.localeCompare(a.achievedAt),
  );
}

/** Suggestions for the "Milstolpe"-action (prototype helper). */
export async function getMilestoneSuggestions(): Promise<string[]> {
  return suggestedMilestones;
}
