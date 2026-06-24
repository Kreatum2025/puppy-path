import type { GuideCategory } from '@/types';
import { guideCategories } from '@/data/guideCategories';

/** Guide hub categories. */
export async function getGuideCategories(): Promise<GuideCategory[]> {
  return guideCategories;
}
