import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme';

interface ProgressBarProps {
  /** Progress 0–1. */
  progress: number;
  /** Track height. */
  height?: number;
  /** Fill color (defaults to forest green). */
  color?: string;
  /** Track color. */
  trackColor?: string;
  style?: ViewStyle;
}

/**
 * Animated progress bar. The fill eases to its target width on mount and when
 * progress changes — used for the week 8→52 journey progress. If animation is
 * unavailable the bar still shows the correct static width.
 */
export function ProgressBar({
  progress,
  height = 10,
  color = colors.primary,
  trackColor = colors.sage,
  style,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(clamped, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height, backgroundColor: trackColor },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { borderRadius: height, backgroundColor: color },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
});
