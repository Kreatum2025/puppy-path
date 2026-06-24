import type { WeeklyGuide } from '@/types';
import { weeklyGuides, SAFETY_DISCLAIMER } from '@/data/weeklyGuides';
import { FIRST_WEEK, LAST_WEEK } from '@/lib/week';

/** Build a "coming soon" placeholder guide for weeks without full content. */
function comingSoonGuide(weekNumber: number): WeeklyGuide {
  return {
    weekNumber,
    title: `Vecka ${weekNumber}`,
    summary: 'Innehåll för den här veckan kommer snart.',
    bodyBrain: '',
    behaviorNote: '',
    focusPoints: [],
    checklist: [],
    disclaimer: SAFETY_DISCLAIMER,
    available: false,
  };
}

/**
 * Full week-by-week timeline (week 8–52). Weeks 8–16 have editorial content;
 * the rest are "Kommer snart" placeholders.
 */
export async function getWeeklyGuides(): Promise<WeeklyGuide[]> {
  const byWeek = new Map(weeklyGuides.map((g) => [g.weekNumber, g]));
  const timeline: WeeklyGuide[] = [];
  for (let week = FIRST_WEEK; week <= LAST_WEEK; week++) {
    timeline.push(byWeek.get(week) ?? comingSoonGuide(week));
  }
  return timeline;
}

/** The guide for a single week, or a placeholder if not yet written. */
export async function getGuideForWeek(weekNumber: number): Promise<WeeklyGuide> {
  return (
    weeklyGuides.find((g) => g.weekNumber === weekNumber) ??
    comingSoonGuide(weekNumber)
  );
}
