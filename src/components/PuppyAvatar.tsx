import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import { PathMark } from './PathMark';
import { colors } from '@/theme';

interface PuppyAvatarProps {
  /** Photo URI, or null to render the premium placeholder. */
  uri?: string | null;
  size?: number;
  /** Corner radius; defaults to a circle. */
  rounded?: number;
  /** Placeholder background color. */
  background?: string;
  /** Placeholder mark color. */
  markColor?: string;
  style?: ViewStyle;
}

/**
 * Puppy image area. Shows the photo when available, otherwise a calm branded
 * placeholder (no cartoon, no stock photo). Used in profile cards and the
 * share card.
 */
export function PuppyAvatar({
  uri,
  size = 72,
  rounded,
  background = colors.sage,
  markColor = colors.primaryDeep,
  style,
}: PuppyAvatarProps) {
  const borderRadius = rounded ?? size / 2;

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius, backgroundColor: background },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius }} />
      ) : (
        <PathMark size={size * 0.5} color={markColor} accent={colors.accent} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
