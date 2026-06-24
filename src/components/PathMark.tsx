import { View, type ViewStyle } from 'react-native';
import { colors } from '@/theme';

interface PathMarkProps {
  /** Overall size of the symbol box. */
  size?: number;
  /** Color of the "path" / P shape. */
  color?: string;
  /** Color of the small accent dot. */
  accent?: string;
  style?: ViewStyle;
}

/**
 * PuppyJourney brand mark — an abstract "path" forming a subtle P-shape with a
 * small dot accent. Built from plain Views (no SVG dependency) so it stays
 * lightweight and scalable. Intentionally not a literal puppy face or paw.
 *
 * Design direction reference for the future app icon: cream symbol on a forest
 * green background.
 */
export function PathMark({
  size = 64,
  color = colors.card,
  accent = colors.accent,
  style,
}: PathMarkProps) {
  const stroke = Math.round(size * 0.12);
  const bowl = Math.round(size * 0.52);
  const dot = Math.round(size * 0.16);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* Stem of the P / the descending path */}
      <View
        style={{
          position: 'absolute',
          left: Math.round(size * 0.16),
          top: 0,
          width: stroke,
          height: size,
          borderRadius: stroke,
          backgroundColor: color,
        }}
      />
      {/* Bowl of the P — an open ring suggesting a turning path */}
      <View
        style={{
          position: 'absolute',
          left: Math.round(size * 0.16),
          top: 0,
          width: bowl,
          height: bowl,
          borderRadius: bowl / 2,
          borderWidth: stroke,
          borderColor: color,
          backgroundColor: 'transparent',
        }}
      />
      {/* Accent dot — the small paw/step on the path */}
      <View
        style={{
          position: 'absolute',
          right: Math.round(size * 0.08),
          bottom: Math.round(size * 0.14),
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: accent,
        }}
      />
    </View>
  );
}
