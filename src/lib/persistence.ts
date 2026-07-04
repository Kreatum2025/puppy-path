import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Challenge,
  GrowthLog,
  Memory,
  Milestone,
  Puppy,
} from '@/types';
import type { WeeklyProgress } from '@/context/PuppyContext';

/**
 * Local, on-device persistence for the prototype's PuppyContext.
 *
 * This is a thin snapshot store, not a sync layer: the whole client state is
 * serialised to a single AsyncStorage key so a testing user's puppy, memories,
 * growth logs and weekly progress survive an app restart. When the Supabase
 * backend lands, these reads/writes move behind the service layer and this
 * module either goes away or becomes a local cache keyed by the signed-in user.
 *
 * Writes are best-effort: a failed read or write must never crash the app or
 * block the UI, so every operation swallows its error (with a __DEV__ warning)
 * and degrades to in-memory-only behaviour (how the app worked before this).
 *
 * NOTE (photos): `puppy.photoUri` / `memories[].photoUri` are persisted verbatim.
 * Today they are always null — there is no image picker yet (see
 * app/onboarding/photo.tsx, which is a placeholder). When `expo-image-picker`
 * is added, the picked cache URI must be copied to a stable location
 * (`expo-file-system` documentDirectory) and stored as a RELATIVE path, then
 * rebuilt on read — a raw cache/`file://` URI does not survive an app update or
 * OS cache eviction. Do not persist the raw picker URI.
 */

const STORAGE_KEY = 'puppyjourney:state:v1';
/** Where an unrecognised (newer) payload is preserved before we fall back. */
const BACKUP_KEY = 'puppyjourney:state:backup';

/** Current on-disk schema version. Bump when the shape below changes. */
const CURRENT_VERSION = 1 as const;

/**
 * Latches when a NEWER-than-known payload is found on disk (e.g. a user
 * downgraded from a future build). While locked, every write is a no-op so the
 * seed-and-save path cannot overwrite data this build doesn't understand.
 */
let writesLocked = false;

function devWarn(message: string, err: unknown): void {
  if (__DEV__) console.warn(`[persistence] ${message}`, err);
}

/**
 * The persisted slice of PuppyContext. Deliberately excludes the onboarding
 * `draft` (transient, in-flight input) and all derived values (week, ages,
 * latestGrowth) — those recompute from `puppy` + `growthHistory` on load.
 *
 * `idSeq` preserves the monotonic local id counter so records created after a
 * reload cannot collide with ids already stored (e.g. two `mem-local-1`).
 *
 * `savedForHomeWeek` records which homecoming week the weekly gamified module
 * (`weeklyProgress` + the two selections) belongs to, so a new week resets it
 * on load instead of showing last week's completion.
 */
export interface PersistedState {
  version: typeof CURRENT_VERSION;
  puppy: Puppy | null;
  growthHistory: GrowthLog[];
  weeklyProgress: WeeklyProgress;
  savedForHomeWeek: number | null;
  selectedMilestone: string | null;
  selectedChallenge: string | null;
  milestones: Milestone[];
  challenges: Challenge[];
  memories: Memory[];
  idSeq: number;
}

/**
 * Structural validation for a `version: 1` payload. A blind `as PersistedState`
 * cast would let a corrupt-but-versioned blob through; most dangerously, a
 * non-finite `idSeq` would make `nextLocalId` emit `*-local-NaN` ids and
 * guarantee the very collisions `idSeq` exists to prevent.
 */
function isValidV1(rec: Record<string, unknown>): boolean {
  return (
    (rec.puppy === null || typeof rec.puppy === 'object') &&
    Array.isArray(rec.growthHistory) &&
    Array.isArray(rec.milestones) &&
    Array.isArray(rec.challenges) &&
    Array.isArray(rec.memories) &&
    typeof rec.weeklyProgress === 'object' &&
    rec.weeklyProgress !== null &&
    (rec.selectedMilestone === null || typeof rec.selectedMilestone === 'string') &&
    (rec.selectedChallenge === null || typeof rec.selectedChallenge === 'string') &&
    // Forward-compat: `savedForHomeWeek` was added within v1. A snapshot written
    // before it existed (undefined) must still load — the weekly module simply
    // rolls over. Only reject a present-but-wrong-typed value.
    (rec.savedForHomeWeek === null ||
      rec.savedForHomeWeek === undefined ||
      Number.isFinite(rec.savedForHomeWeek)) &&
    Number.isFinite(rec.idSeq)
  );
}

/**
 * Load the persisted snapshot, or `null` when there is nothing usable to
 * restore (fresh install, corrupt payload, or an older/unknown schema version).
 * A `null` result tells the provider to fall back to the service-layer seed,
 * preserving the original first-launch behaviour.
 */
export async function loadPersistedState(): Promise<PersistedState | null> {
  let raw: string | null = null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (err) {
    devWarn('read failed', err);
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    devWarn('corrupt JSON, ignoring', err);
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;

  const rec = parsed as Record<string, unknown>;
  const version = rec.version;

  // Newer-than-known payload: do NOT destroy it. Back it up, lock writes so the
  // seed path can't overwrite it, and fall back to a fresh seed for this run.
  if (typeof version === 'number' && version > CURRENT_VERSION) {
    writesLocked = true;
    try {
      await AsyncStorage.setItem(BACKUP_KEY, raw);
    } catch (err) {
      devWarn('backup of newer payload failed', err);
    }
    return null;
  }

  // Only the exact current version is trusted. Older/unknown is discarded
  // rather than half-migrated (no migrations exist yet).
  if (version !== CURRENT_VERSION) return null;

  if (!isValidV1(rec)) {
    devWarn('stored snapshot failed validation, ignoring', rec);
    return null;
  }

  return parsed as PersistedState;
}

/**
 * Persist the current snapshot. Best-effort: write failures are swallowed (with
 * a __DEV__ warning) so full/blocked storage never breaks the logging flow. A
 * no-op while writes are locked (a newer payload is on disk — see loader).
 */
export async function savePersistedState(
  state: Omit<PersistedState, 'version'>,
): Promise<void> {
  if (writesLocked) return;
  try {
    const payload: PersistedState = { version: CURRENT_VERSION, ...state };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    devWarn('write failed', err);
  }
}

/**
 * Wipe the persisted snapshot (e.g. a future "start over" / reset action).
 * Not wired into the UI yet, but kept here so the reset path has a single,
 * documented home instead of poking AsyncStorage directly from a screen.
 */
export async function clearPersistedState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    devWarn('clear failed', err);
  }
}
