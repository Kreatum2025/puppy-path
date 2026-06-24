/**
 * PuppyJourney color tokens.
 * Modern Scandinavian premium — fresh forest / nature feeling.
 * Never hardcode hex values in components; always import from here.
 */
export const colors = {
  // Brand greens
  primary: '#1F5A3D', // forest green
  primaryDeep: '#143D2B', // deep forest
  sage: '#A8CBB3', // soft sage

  // Surfaces
  background: '#F7F1E6', // cream app background
  card: '#FFF9EF', // warm beige card
  border: '#E7D8C5', // soft sand border

  // Accent
  accent: '#D9895B', // warm terracotta / orange

  // Text
  text: '#1F2A24', // dark
  textMuted: '#6E7A72', // muted

  // Status
  success: '#3C8B5A',
  warning: '#C77B4A',

  // Utility
  white: '#FFFFFF',
  overlay: 'rgba(20, 61, 43, 0.45)', // deep-forest scrim for modals
  shadow: '#1F2A24',
} as const;

export type ColorToken = keyof typeof colors;
