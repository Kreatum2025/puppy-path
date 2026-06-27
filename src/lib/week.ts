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
 * Weeks since the puppy came home - the emotional journey index. "First week
 * home" = 1. Falls back to 1 when no homecoming date is known (older/local
 * state). Drives the homecoming-based journey copy ("Första veckan hemma"),
 * separate from biological age (puppy_age_weeks).
 */
export function homeWeekIndex(
  homecomingISO: string | null | undefined,
  now: Date = new Date(),
): number {
  if (!homecomingISO) return 1;
  const days = Math.max(0, daysBetween(parseISODate(homecomingISO), now));
  return Math.max(1, Math.floor(days / 7) + 1);
}

/**
 * Homecoming-based label for the UI. "Vecka 1" is never used standalone; the
 * first weeks read as "Första/Andra/... veckan hemma", later weeks as
 * "Vecka N hemma" (allowed because it is explicitly "hemma").
 */
export function homeWeekLabel(index: number): string {
  const ordinals = ['', 'Första', 'Andra', 'Tredje', 'Fjärde'];
  if (index >= 1 && index <= 4) return `${ordinals[index]} veckan hemma`;
  return `Vecka ${index} hemma`;
}

/**
 * Progress (0–1) through the first year, from week 8 to week 52.
 * Used by puppy development/progress UI where biological age is needed.
 */
export function yearProgress(week: number): number {
  const clamped = clampWeek(week);
  return (clamped - FIRST_WEEK) / (LAST_WEEK - FIRST_WEEK);
}

/** Total weeks in the tracked journey (inclusive). */
export const TOTAL_JOURNEY_WEEKS = LAST_WEEK - FIRST_WEEK + 1;
