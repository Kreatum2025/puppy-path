import type { NativeOffer } from '@/types';
import { nativeOffers, weeklyPartnerExample } from '@/data/offers';

/** All lifecycle-based offer placeholders for the Offers screen. */
export async function getOffers(): Promise<NativeOffer[]> {
  return nativeOffers;
}

/** The single subtle partner example shown on Today. */
export async function getWeeklyPartnerExample(): Promise<typeof weeklyPartnerExample> {
  return weeklyPartnerExample;
}
