import type { ShareCardTheme } from '@/types';
import { colors } from '@/theme';

/** Selectable visual themes for the weekly share card. */
export const shareCardThemes: ShareCardTheme[] = [
  {
    id: 'forest',
    name: 'Forest',
    background: colors.primaryDeep,
    text: colors.white,
    textMuted: 'rgba(255, 249, 239, 0.72)',
    accent: colors.sage,
    border: 'rgba(255, 249, 239, 0.16)',
    photoBackground: '#1B4E36',
  },
  {
    id: 'cream',
    name: 'Cream',
    background: colors.card,
    text: colors.text,
    textMuted: colors.textMuted,
    accent: colors.accent,
    border: colors.border,
    photoBackground: '#F0E4D2',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    background: colors.white,
    text: colors.text,
    textMuted: colors.textMuted,
    accent: colors.primary,
    border: '#ECECEC',
    photoBackground: '#F4F4F2',
  },
];
