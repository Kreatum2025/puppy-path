/**
 * PuppyJourney color tokens.
 * Modern Scandinavian premium with a warm forest and moss feeling.
 * Cream is the base, forest green carries the identity, moss/sage are secondary
 * surfaces and sand/beige add warmth. Never hardcode hex values in components;
 * always import from here.
 */
export const colors = {
  // Brand greens
  primary: '#2F5A42', // forest green (buttons, active state)
  primaryDeep: '#243D2F', // deep forest (hero panels)
  primarySoft: '#A8B79F', // soft green-grey
  forest: '#3F5843', // forest surface accent
  moss: '#7C8B76', // moss green
  sage: '#A8B59E', // soft sage

  // Green surfaces
  surfaceSage: '#EEF2EA', // light sage surface (secondary cards)
  surfaceForest: '#3F5843', // forest surface (used sparingly)
  textOnForest: '#F6F3EA', // text on forest/green surfaces

  // Base surfaces
  background: '#F6F3EA', // warm cream app background
  card: '#FFFDF8', // near-white card
  border: '#E3D6C4', // soft sand border

  // Warm details
  sand: '#E7D9BF', // soft beige detail
  warmBeige: '#C9AA86', // warmer beige
  soil: '#7A5A42', // brown detail
  accent: '#D4896A', // terracotta (use sparingly)

  // Text
  text: '#26352B', // dark green-brown
  textMuted: '#66736A', // muted

  // Status
  success: '#3C8B5A',
  warning: '#C77B4A',

  // Utility
  white: '#FFFFFF',
  overlay: 'rgba(36, 61, 47, 0.45)', // deep-forest scrim for modals
  shadow: '#1F2A24',
} as const;

export type ColorToken = keyof typeof colors;
