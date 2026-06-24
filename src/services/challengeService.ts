import type { Challenge } from '@/types';
import { mockChallenges, suggestedChallenges } from '@/data/challenges';

/** This week's logged challenges, newest first. */
export async function getWeeklyChallenges(): Promise<Challenge[]> {
  return [...mockChallenges].sort((a, b) =>
    b.loggedAt.localeCompare(a.loggedAt),
  );
}

/** Suggestions for the "Utmaning"-action (prototype helper). */
export async function getChallengeSuggestions(): Promise<string[]> {
  return suggestedChallenges;
}
