/**
 * Small date helpers. No external date library — keep dependencies minimal.
 */

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const SWEDISH_MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'dec',
];

/** Parse an ISO date string into a Date at local midnight. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('T')[0].split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Format a Date as ISO yyyy-mm-dd. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Whole days between two dates (b - a). */
export function daysBetween(a: Date, b: Date): number {
  const aMid = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const bMid = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((bMid - aMid) / MS_PER_DAY);
}

/** Subtract a number of days from a date (new Date). */
export function subDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * MS_PER_DAY);
}

/** Human friendly Swedish date, e.g. "31 mar 2026". */
export function formatSwedishDate(iso: string): string {
  const d = parseISODate(iso);
  return `${d.getDate()} ${SWEDISH_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
