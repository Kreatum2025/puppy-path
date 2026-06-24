import { daysBetween, parseISODate } from './dates';

/** PuppyJourney follows the first year: week 8 (8 weeks old) to week 52. */
export const FIRST_WEEK = 8;
export const LAST_WEEK = 52;

/** Clamp any week number into the supported [8, 52] range. */
export function clampWeek(week: number): number {
  return Math.min(LAST_WEEK, Math.max(FIRST_WEEK, Math.round(week)));
}

/** Age of the puppy in whole weeks from date of birth (ISO) until `now`. */
export function ageInWeeks(dateOfBirthISO: string, now: Date = new Date()): number {
  const dob = parseISODate(dateOfBirthISO);
  const days = Math.max(0, daysBetween(dob, now));
  return Math.floor(days / 7);
}

/** Age in whole days. */
export function ageInDays(dateOfBirthISO: string, now: Date = new Date()): number {
  return Math.max(0, daysBetween(parseISODate(dateOfBirthISO), now));
}

/** The puppy's current journey week, clamped to the supported range. */
export function currentWeek(dateOfBirthISO: string, now: Date = new Date()): number {
  return clampWeek(ageInWeeks(dateOfBirthISO, now));
}

/**
 * Progress (0–1) through the first year, from week 8 to week 52.
 * Used by the animated progress bar on the Today screen.
 */
export function yearProgress(week: number): number {
  const clamped = clampWeek(week);
  return (clamped - FIRST_WEEK) / (LAST_WEEK - FIRST_WEEK);
}

/** Total weeks in the tracked journey (inclusive). */
export const TOTAL_JOURNEY_WEEKS = LAST_WEEK - FIRST_WEEK + 1;
