import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { IoniconName } from '@/types/icons';
import { colors, radius } from '@/theme';

export type { IoniconName };

interface IconCircleProps {
  name: IoniconName;
  /** Diameter of the circle. */
  size?: number;
  /** Visual tone. */
  tone?: 'neutral' | 'forest' | 'sand';
  style?: ViewStyle;
}

const TONES: Record<NonNullable<IconCircleProps['tone']>, { bg: string; fg: string }> = {
  neutral: { bg: colors.background, fg: colors.primary },
  forest: { bg: colors.sage, fg: colors.primaryDeep },
  sand: { bg: '#F4E7D7', fg: colors.warning },
};

/**
 * A line icon (Ionicons) in a discreet soft circle. Standardised, neutral
 * treatment so icons aid scanning without an "emoji" feel — text stays the hero.
 */
export function IconCircle({ name, size = 44, tone = 'neutral', style }: IconCircleProps) {
  const palette = TONES[tone];
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: radius.md, backgroundColor: palette.bg },
        style,
      ]}
    >
      <Ionicons name={name} size={Math.round(size * 0.46)} color={palette.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
