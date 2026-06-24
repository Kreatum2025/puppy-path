import type { GrowthLog } from '@/types';
import { mockLatestGrowth, mockGrowthHistory } from '@/data/mockPuppy';

/** Latest weight & withers height reading. */
export async function getLatestGrowth(): Promise<GrowthLog> {
  return mockLatestGrowth;
}

/** Full growth history (oldest → newest), for future charts. */
export async function getGrowthHistory(): Promise<GrowthLog[]> {
  return mockGrowthHistory;
}
