import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { BreedId, Challenge, GrowthLog, Memory, Milestone, Puppy } from '@/types';
import { getCurrentPuppy } from '@/services/puppyService';
import { getGrowthHistory } from '@/services/growthService';
import { breedNameById } from '@/services/breedService';
import { ageInWeeks, currentWeek, homeWeekIndex, homeWeekLabel } from '@/lib/week';
import { toISODate } from '@/lib/dates';

/** Simple monotonic id generator for locally created records (prototype). */
let localIdSeq = 0;
function nextLocalId(prefix: string): string {
  localIdSeq += 1;
  return `${prefix}-local-${localIdSeq}`;
}

/**
 * In-memory prototype state. Holds the active puppy, the onboarding draft and
 * the weekly logging progress that powers the Today screen's gamified module
 * and the share card preview.
 *
 * This is intentionally local/ephemeral. When the backend is added, this layer
 * stays as a thin client cache and the writes below go through services →
 * Supabase instead of mutating local state directly.
 */

/** The five weekly "memories" tracked for light gamification. */
export interface WeeklyProgress {
  weightLogged: boolean;
  heightLogged: boolean;
  photoSaved: boolean;
  milestoneSelected: boolean;
  challengeSelected: boolean;
}

export const WEEKLY_TASK_COUNT = 5;

export interface OnboardingDraft {
  name: string;
  breedId: BreedId | null;
  dateOfBirth: string | null;
  homecomingDate: string | null;
  photoUri: string | null;
  weightKg: number | null;
  withersHeightCm: number | null;
}

const emptyDraft: OnboardingDraft = {
  name: '',
  breedId: null,
  dateOfBirth: null,
  homecomingDate: null,
  photoUri: null,
  weightKg: null,
  withersHeightCm: null,
};

const emptyProgress: WeeklyProgress = {
  weightLogged: false,
  heightLogged: false,
  photoSaved: false,
  milestoneSelected: false,
  challengeSelected: false,
};

interface PuppyContextValue {
  loading: boolean;
  puppy: Puppy | null;
  latestGrowth: GrowthLog | null;
  /** All logged growth points (oldest → newest), for the growth chart. */
  growthHistory: GrowthLog[];
  week: number;
  /** Biological age in weeks (knowledge/development). */
  puppyAgeWeeks: number;
  /** Weeks since homecoming, min 1 (emotional journey). */
  homeWeekIndex: number;

  // Onboarding draft
  draft: OnboardingDraft;
  updateDraft: (patch: Partial<OnboardingDraft>) => void;
  /** Finalise onboarding into the active puppy (prototype: local only). */
  commitOnboarding: () => void;
  resetDraft: () => void;

  // Weekly gamified progress
  weeklyProgress: WeeklyProgress;
  completedCount: number;
  selectedMilestone: string | null;
  selectedChallenge: string | null;

  // The puppy's own logged records (empty for a freshly created puppy)
  milestones: Milestone[];
  challenges: Challenge[];

  // Saved memories - the puppy's memory book ("Första kapitlet")
  memories: Memory[];

  // Mock log actions (update local state, no backend)
  logWeight: (weightKg: number) => void;
  logHeight: (withersHeightCm: number) => void;
  savePhoto: (uri?: string | null) => void;
  selectMilestone: (title: string) => void;
  selectChallenge: (title: string) => void;
  saveMemory: (text: string, linkedTo?: Memory['linkedTo']) => void;
}

const PuppyContext = createContext<PuppyContextValue | undefined>(undefined);

export function PuppyProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [puppy, setPuppy] = useState<Puppy | null>(null);
  const [growthHistory, setGrowthHistory] = useState<GrowthLog[]>([]);
  const [draft, setDraft] = useState<OnboardingDraft>(emptyDraft);
  const [weeklyProgress, setWeeklyProgress] =
    useState<WeeklyProgress>(emptyProgress);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    null,
  );
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(
    null,
  );
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  // Seed from the service layer (mock now, Supabase later).
  useEffect(() => {
    let active = true;
    (async () => {
      const [p, hist] = await Promise.all([
        getCurrentPuppy(),
        getGrowthHistory(),
      ]);
      if (!active) return;
      setPuppy(p);
      setGrowthHistory(hist);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const week = useMemo(
    () => (puppy ? currentWeek(puppy.dateOfBirth) : 0),
    [puppy],
  );

  // Biological age (knowledge) and homecoming index (emotional journey) - kept
  // separate per the locked terminology. See docs/PRODUCT_MECHANICS.md.
  const puppyAgeWeeks = useMemo(
    () => (puppy ? ageInWeeks(puppy.dateOfBirth) : 0),
    [puppy],
  );
  const homeWeek = useMemo(
    () => (puppy ? homeWeekIndex(puppy.homecomingDate) : 1),
    [puppy],
  );

  /**
   * Latest known values, derived from the logged history. Weight and withers
   * height are tracked independently, so each falls back to its most recent
   * non-null reading.
   */
  const latestGrowth = useMemo<GrowthLog | null>(() => {
    if (growthHistory.length === 0) return null;
    const last = growthHistory[growthHistory.length - 1];
    const lastWeight = [...growthHistory]
      .reverse()
      .find((g) => g.weightKg != null);
    const lastHeight = [...growthHistory]
      .reverse()
      .find((g) => g.withersHeightCm != null);
    return {
      id: last.id,
      puppyId: last.puppyId,
      measuredAt: last.measuredAt,
      weightKg: lastWeight?.weightKg ?? null,
      withersHeightCm: lastHeight?.withersHeightCm ?? null,
    };
  }, [growthHistory]);

  const updateDraft = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(emptyDraft), []);

  const commitOnboarding = useCallback(() => {
    const puppyId = 'puppy-local';
    const dob = draft.dateOfBirth ?? toISODate(new Date());
    const breedId = draft.breedId ?? 'mixed';

    // A freshly created puppy starts with a clean slate — no inherited demo
    // data. Milestones, challenges, growth and weekly progress all reset, so the
    // profile honestly reflects what the owner has actually logged.
    setPuppy({
      id: puppyId,
      name: draft.name.trim() || 'Min valp',
      breedId,
      breedName: breedNameById(breedId),
      dateOfBirth: dob,
      homecomingDate: draft.homecomingDate ?? toISODate(new Date()),
      photoUri: draft.photoUri ?? null,
      createdAt: toISODate(new Date()),
    });
    // Seed the growth history only with what the owner actually entered during
    // onboarding (one point, or none). The chart fills in honestly from there.
    const seedGrowth: GrowthLog[] =
      draft.weightKg != null || draft.withersHeightCm != null
        ? [
            {
              id: nextLocalId('growth'),
              puppyId,
              measuredAt: toISODate(new Date()),
              weightKg: draft.weightKg ?? null,
              withersHeightCm: draft.withersHeightCm ?? null,
            },
          ]
        : [];
    setGrowthHistory(seedGrowth);
    setMilestones([]);
    setChallenges([]);
    setMemories([]);
    setSelectedMilestone(null);
    setSelectedChallenge(null);
    setWeeklyProgress(emptyProgress);
  }, [draft]);

  const logWeight = useCallback(
    (weightKg: number) => {
      setGrowthHistory((prev) => [
        ...prev,
        {
          id: nextLocalId('growth'),
          puppyId: puppy?.id ?? 'puppy-local',
          measuredAt: toISODate(new Date()),
          weightKg,
          withersHeightCm: null,
        },
      ]);
      setWeeklyProgress((p) => ({ ...p, weightLogged: true }));
    },
    [puppy],
  );

  const logHeight = useCallback(
    (withersHeightCm: number) => {
      setGrowthHistory((prev) => [
        ...prev,
        {
          id: nextLocalId('growth'),
          puppyId: puppy?.id ?? 'puppy-local',
          measuredAt: toISODate(new Date()),
          weightKg: null,
          withersHeightCm,
        },
      ]);
      setWeeklyProgress((p) => ({ ...p, heightLogged: true }));
    },
    [puppy],
  );

  const savePhoto = useCallback((uri?: string | null) => {
    setPuppy((prev) => (prev ? { ...prev, photoUri: uri ?? prev.photoUri } : prev));
    setWeeklyProgress((p) => ({ ...p, photoSaved: true }));
  }, []);

  const selectMilestone = useCallback(
    (title: string) => {
      setSelectedMilestone(title);
      setMilestones((prev) => [
        {
          id: nextLocalId('ms'),
          puppyId: puppy?.id ?? 'puppy-local',
          title,
          weekNumber: week,
          achievedAt: toISODate(new Date()),
        },
        ...prev,
      ]);
      setWeeklyProgress((p) => ({ ...p, milestoneSelected: true }));
    },
    [puppy, week],
  );

  const selectChallenge = useCallback(
    (title: string) => {
      setSelectedChallenge(title);
      setChallenges((prev) => [
        {
          id: nextLocalId('ch'),
          puppyId: puppy?.id ?? 'puppy-local',
          title,
          weekNumber: week,
          loggedAt: toISODate(new Date()),
        },
        ...prev,
      ]);
      setWeeklyProgress((p) => ({ ...p, challengeSelected: true }));
    },
    [puppy, week],
  );

  const saveMemory = useCallback(
    (text: string, linkedTo: Memory['linkedTo'] = 'daily_goal') => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setMemories((prev) => [
        {
          id: nextLocalId('mem'),
          puppyId: puppy?.id ?? 'puppy-local',
          text: trimmed,
          linkedTo,
          homeWeekLabel: homeWeekLabel(homeWeek),
          puppyAgeWeeks,
          photoUri: null,
          createdAt: toISODate(new Date()),
        },
        ...prev,
      ]);
    },
    [puppy, homeWeek, puppyAgeWeeks],
  );

  const completedCount = useMemo(
    () => Object.values(weeklyProgress).filter(Boolean).length,
    [weeklyProgress],
  );

  const value = useMemo<PuppyContextValue>(
    () => ({
      loading,
      puppy,
      latestGrowth,
      growthHistory,
      week,
      puppyAgeWeeks,
      homeWeekIndex: homeWeek,
      draft,
      updateDraft,
      commitOnboarding,
      resetDraft,
      weeklyProgress,
      completedCount,
      selectedMilestone,
      selectedChallenge,
      milestones,
      challenges,
      logWeight,
      logHeight,
      savePhoto,
      selectMilestone,
      selectChallenge,
      memories,
      saveMemory,
    }),
    [
      loading,
      puppy,
      latestGrowth,
      growthHistory,
      week,
      puppyAgeWeeks,
      homeWeek,
      draft,
      updateDraft,
      commitOnboarding,
      resetDraft,
      weeklyProgress,
      completedCount,
      selectedMilestone,
      selectedChallenge,
      milestones,
      challenges,
      logWeight,
      logHeight,
      savePhoto,
      selectMilestone,
      selectChallenge,
      memories,
      saveMemory,
    ],
  );

  return <PuppyContext.Provider value={value}>{children}</PuppyContext.Provider>;
}

export function usePuppy(): PuppyContextValue {
  const ctx = useContext(PuppyContext);
  if (!ctx) {
    throw new Error('usePuppy must be used within a PuppyProvider');
  }
  return ctx;
}
