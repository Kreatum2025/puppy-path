import type { TextStyle } from 'react-native';

/**
 * Typography tokens.
 * Display/serif: Fraunces (warm, premium, emotional — for headings & hero numbers).
 * UI/sans: Inter (clean, highly legible — for body & controls).
 *
 * Font families are loaded in app/_layout.tsx via @expo-google-fonts.
 * If a font fails to load we still render with the platform default, so the
 * UI never depends on fonts being present (graceful fallback).
 */
export const fonts = {
  displayRegular: 'Fraunces_400Regular',
  displayMedium: 'Fraunces_500Medium',
  displaySemiBold: 'Fraunces_600SemiBold',
  bodyRegular: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

type TypePreset = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'
>;

export const type = {
  /** Hero serif title, e.g. welcome headline */
  hero: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  } satisfies TypePreset,
  /** Section / screen title */
  title: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
  } satisfies TypePreset,
  /** Card heading */
  heading: {
    fontFamily: fonts.displayMedium,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  } satisfies TypePreset,
  /** Large stat number (serif) */
  stat: {
    fontFamily: fonts.displaySemiBold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.4,
  } satisfies TypePreset,
  /** Emphasised label */
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.3,
  } satisfies TypePreset,
  /** Standard body */
  body: {
    fontFamily: fonts.bodyRegular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  } satisfies TypePreset,
  /** Emphasised body */
  bodyStrong: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  } satisfies TypePreset,
  /** Small caption / muted meta */
  caption: {
    fontFamily: fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  } satisfies TypePreset,
  /** Tiny overline label (uppercase) */
  overline: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
  } satisfies TypePreset,
} as const;

export type TypePresetName = keyof typeof type;
