import { StyleSheet, View, type ViewStyle } from 'react-native';
import { PathMark } from './PathMark';
import { colors, radius } from '@/theme';

interface StoryImageSlotProps {
  /** Width / height ratio, e.g. 16 / 10. */
  aspectRatio?: number;
  /** Soft surface tone behind the future image. */
  tone?: 'sage' | 'sand';
  /** Size of the brand mark inside the halo. */
  markSize?: number;
  style?: ViewStyle;
}

/**
 * An intentional, editorial image-ready surface for future photography or
 * illustration. Until real assets exist it reads as a designed emblem (a soft
 * two-tone field with a centered halo and brand mark), not an empty placeholder,
 * and never shows the word "placeholder" in the UI.
 */
export function StoryImageSlot({
  aspectRatio = 16 / 10,
  tone = 'sage',
  markSize = 44,
  style,
}: StoryImageSlotProps) {
  const base = tone === 'sand' ? colors.sand : colors.surfaceSage;
  const halo = tone === 'sand' ? colors.surfaceSage : colors.sand;
  return (
    <View style={[styles.slot, { aspectRatio, backgroundColor: base }, style]}>
      {/* soft layered band for depth */}
      <View style={[styles.band, { backgroundColor: halo }]} />
      <View style={[styles.halo, { backgroundColor: halo }]}>
        <PathMark size={markSize} color={colors.primary} accent={colors.moss} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '100%',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '38%',
    opacity: 0.5,
  },
  halo: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
