import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BreedId, Challenge, GrowthLog, Memory, Milestone, Puppy } from '@/types';
import { getCurrentPuppy } from '@/services/puppyService';
import { getGrowthHistory } from '@/services/growthService';
import { breedNameById } from '@/services/breedService';
import { ageInWeeks, currentWeek, homeWeekIndex, homeWeekLabel } from '@/lib/week';
import { toISODate } from '@/lib/dates';
import { loadPersistedState, savePersistedState } from '@/lib/persistence';

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
  commitOnboarding: (overrides?: Partial<OnboardingDraft>) => void;
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

  // Tracks whether the initial hydrate/seed has completed. We must not persist
  // before the first load resolves, or an empty default snapshot would clobber
  // real stored data on every launch.
  const hydratedRef = useRef(false);

  // Hydrate from on-device storage first; only fall back to the service-layer
  // seed (mock now, Supabase later) when there is no saved snapshot. This is
  // what makes a testing user's puppy, memories and logs survive a restart.
  useEffect(() => {
    let active = true;
    (async () => {
      const persisted = await loadPersistedState();
      if (!active) return;

      if (persisted) {
        setPuppy(persisted.puppy);
        setGrowthHistory(persisted.growthHistory);
        setMilestones(persisted.milestones);
        setChallenges(persisted.challenges);
        setMemories(persisted.memories);

        // The weekly gamified module (progress + the two selections) belongs to
        // one homecoming week. If the stored snapshot is from an earlier week,
        // roll it over (reset) instead of showing last week's completion — this
        // restores the implicit weekly reset that in-memory state gave for free.
        // History (milestones/challenges/memories) is kept regardless.
        const currentHomeWeek = homeWeekIndex(persisted.puppy?.homecomingDate);
        const staleWeek = persisted.savedForHomeWeek !== currentHomeWeek;
        setWeeklyProgress(staleWeek ? emptyProgress : persisted.weeklyProgress);
        setSelectedMilestone(staleWeek ? null : persisted.selectedMilestone);
        setSelectedChallenge(staleWeek ? null : persisted.selectedChallenge);

        // Resume the local id counter past anything already stored so newly
        // created records can't reuse an id already on disk (e.g. mem-local-1).
        localIdSeq = persisted.idSeq;
      } else {
        const [p, hist] = await Promise.all([
          getCurrentPuppy(),
          getGrowthHistory(),
        ]);
        if (!active) return;
        setPuppy(p);
        setGrowthHistory(hist);
      }

      hydratedRef.current = true;
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist a snapshot whenever any stored slice changes, but only after the
  // initial load has resolved. Fire-and-forget and best-effort: a failed write
  // simply degrades to in-memory-only, exactly as before persistence existed.
  useEffect(() => {
    if (!hydratedRef.current) return;
    void savePersistedState({
      puppy,
      growthHistory,
      weeklyProgress,
      // Stamp the week this progress belongs to so hydration can roll it over.
      savedForHomeWeek: homeWeekIndex(puppy?.homecomingDate),
      selectedMilestone,
      selectedChallenge,
      milestones,
      challenges,
      memories,
      idSeq: localIdSeq,
    });
  }, [
    puppy,
    growthHistory,
    weeklyProgress,
    selectedMilestone,
    selectedChallenge,
    milestones,
    challenges,
    memories,
  ]);

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

  const commitOnboarding = useCallback(
    (overrides?: Partial<OnboardingDraft>) => {
    // Merge any values set in the SAME handler as commit (e.g. the measurements
    // step) so they are not lost to React's async setState batching.
    const d = { ...draft, ...overrides };
    const puppyId = 'puppy-local';
    const dob = d.dateOfBirth ?? toISODate(new Date());
    const breedId = d.breedId ?? 'mixed';

    // A freshly created puppy starts with a clean slate — no inherited demo
    // data. Milestones, challenges, growth and weekly progress all reset, so the
    // profile honestly reflects what the owner has actually logged.
    setPuppy({
      id: puppyId,
      name: d.name.trim() || 'Min valp',
      breedId,
      breedName: breedNameById(breedId),
      dateOfBirth: dob,
      homecomingDate: d.homecomingDate ?? toISODate(new Date()),
      photoUri: d.photoUri ?? null,
      createdAt: toISODate(new Date()),
    });
    // Seed the growth history only with what the owner actually entered during
    // onboarding (one point, or none). The chart fills in honestly from there.
    const seedGrowth: GrowthLog[] =
      d.weightKg != null || d.withersHeightCm != null
        ? [
            {
              id: nextLocalId('growth'),
              puppyId,
              measuredAt: toISODate(new Date()),
              weightKg: d.weightKg ?? null,
              withersHeightCm: d.withersHeightCm ?? null,
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
      // Build the record OUTSIDE the updater so the id/timestamp are generated
      // exactly once (updaters are re-invoked under React StrictMode).
      const entry: GrowthLog = {
        id: nextLocalId('growth'),
        puppyId: puppy?.id ?? 'puppy-local',
        measuredAt: toISODate(new Date()),
        weightKg,
        withersHeightCm: null,
      };
      setGrowthHistory((prev) => [...prev, entry]);
      setWeeklyProgress((p) => ({ ...p, weightLogged: true }));
    },
    [puppy],
  );

  const logHeight = useCallback(
    (withersHeightCm: number) => {
      const entry: GrowthLog = {
        id: nextLocalId('growth'),
        puppyId: puppy?.id ?? 'puppy-local',
        measuredAt: toISODate(new Date()),
        weightKg: null,
        withersHeightCm,
      };
      setGrowthHistory((prev) => [...prev, entry]);
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
      const entry: Milestone = {
        id: nextLocalId('ms'),
        puppyId: puppy?.id ?? 'puppy-local',
        title,
        weekNumber: week,
        achievedAt: toISODate(new Date()),
      };
      setSelectedMilestone(title);
      setMilestones((prev) => [entry, ...prev]);
      setWeeklyProgress((p) => ({ ...p, milestoneSelected: true }));
    },
    [puppy, week],
  );

  const selectChallenge = useCallback(
    (title: string) => {
      const entry: Challenge = {
        id: nextLocalId('ch'),
        puppyId: puppy?.id ?? 'puppy-local',
        title,
        weekNumber: week,
        loggedAt: toISODate(new Date()),
      };
      setSelectedChallenge(title);
      setChallenges((prev) => [entry, ...prev]);
      setWeeklyProgress((p) => ({ ...p, challengeSelected: true }));
    },
    [puppy, week],
  );

  const saveMemory = useCallback(
    (text: string, linkedTo: Memory['linkedTo'] = 'daily_goal') => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const entry: Memory = {
        id: nextLocalId('mem'),
        puppyId: puppy?.id ?? 'puppy-local',
        text: trimmed,
        linkedTo,
        homeWeekLabel: homeWeekLabel(homeWeek),
        puppyAgeWeeks,
        photoUri: null,
        createdAt: toISODate(new Date()),
      };
      setMemories((prev) => [entry, ...prev]);
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
