/**
 * Journey, memory, guide and digest domain types.
 * Mirror future Supabase tables; consumed only through the service layer.
 */
import type { IoniconName } from './icons';

/** Future table: milestones */
export interface Milestone {
  id: string;
  puppyId: string;
  title: string;
  /** Optional note from the owner. */
  note?: string;
  /** Week number (8–52) this milestone belongs to. */
  weekNumber: number;
  /** ISO datetime. */
  achievedAt: string;
  /** Emoji or icon key for a warm, non-cartoon accent. */
  icon?: string;
}

/** Future table: challenges (weekly behaviour the owner is working through) */
export interface Challenge {
  id: string;
  puppyId: string;
  title: string;
  weekNumber: number;
  /** ISO datetime. */
  loggedAt: string;
  icon?: string;
}

/** Future table: memory_photos (Storage-backed later) */
export interface MemoryPhoto {
  id: string;
  puppyId: string;
  /** Local URI now; Supabase Storage URL later. */
  uri: string | null;
  weekNumber: number;
  /** ISO datetime. */
  capturedAt: string;
  caption?: string;
}

/** Editorial content; future table: weekly_guides (or static content) */
export interface WeeklyGuide {
  weekNumber: number;
  title: string;
  summary: string;
  /** Body & brain development. */
  bodyBrain: string;
  /** Behaviour note. */
  behaviorNote: string;
  focusPoints: string[];
  checklist: string[];
  /** Safety disclaimer shown on every week card. */
  disclaimer: string;
  /** Whether full content exists yet (weeks 8–16) or is "coming soon". */
  available: boolean;
}

/**
 * AI Weekly Digest. Placeholder only in this prototype — generated later by a
 * backend function from the owner's own logged data. No real AI calls now.
 */
export interface WeeklyDigest {
  id: string;
  puppyId: string;
  weekNumber: number;
  /** Soft, emotional summary caption. */
  caption: string;
  /** True only when generated from real logged data (always false for now). */
  generated: boolean;
}

export interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
}

export type ShareCardThemeId = 'forest' | 'cream' | 'minimal';

export interface ShareCardTheme {
  id: ShareCardThemeId;
  name: string;
  /** Background of the card. */
  background: string;
  /** Primary text color. */
  text: string;
  /** Muted/secondary text color. */
  textMuted: string;
  /** Accent used for highlights and branding. */
  accent: string;
  /** Border / divider color. */
  border: string;
  /** Photo frame background (when no photo). */
  photoBackground: string;
}

export interface NativeOffer {
  id: string;
  category: string;
  title: string;
  description: string;
  /** Weeks where this lifecycle recommendation is relevant. */
  relevantWeeks: [number, number];
  icon: IoniconName;
}
