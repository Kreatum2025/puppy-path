import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from './AppText';
import { colors, radius, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'lg' | 'md';

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  /** Optional leading element (e.g. an icon/emoji). */
  leading?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Primary action button with a subtle Reanimated press-scale. The animation is
 * decorative only — the button works identically if the animation is skipped.
 */
export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  leading,
  fullWidth = true,
  style,
}: AppButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const palette = VARIANTS[variant];
  const heightStyle = size === 'lg' ? styles.lg : styles.md;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value mutation
        scale.value = withTiming(0.97, { duration: 90 });
      }}
      onPressOut={() => {
        // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value mutation
        scale.value = withTiming(1, { duration: 120 });
      }}
      style={[
        styles.base,
        heightStyle,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: palette.border ? StyleSheet.hairlineWidth * 2 : 0,
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        animatedStyle,
        style,
      ]}
    >
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <AppText variant="bodyStrong" color={palette.text}>
        {label}
      </AppText>
    </AnimatedPressable>
  );
}

const VARIANTS: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, text: colors.white },
  secondary: { bg: colors.card, text: colors.primary, border: colors.border },
  ghost: { bg: 'transparent', text: colors.primary },
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
  },
  lg: { height: 56 },
  md: { height: 46, paddingHorizontal: spacing.lg },
  leading: { marginRight: spacing.sm },
});
