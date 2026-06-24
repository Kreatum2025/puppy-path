import type { Ionicons } from '@expo/vector-icons';

/**
 * Valid Ionicons glyph name. Single source for icon-name typing across the app,
 * so data files and components agree on what counts as a valid icon.
 */
export type IoniconName = keyof typeof Ionicons.glyphMap;
