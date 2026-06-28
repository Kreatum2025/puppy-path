import { useEffect } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AppButton, AppText, PathMark } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { homeWeekLabel } from '@/lib/week';
import { colors, spacing } from '@/theme';

const webCenter: ViewStyle | null =
  Platform.OS === 'web' ? { width: '100%', maxWidth: 560, alignSelf: 'center' } : null;

/** Reward screen — a calm, warm payoff after onboarding. */
export default function OnboardingDone() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { puppy, puppyAgeWeeks, homeWeekIndex } = usePuppy();
  const name = puppy?.name ?? 'Din valp';
  const homeLabel = homeWeekLabel(homeWeekIndex);

  const badgeScale = useSharedValue(0.6);
  useEffect(() => {
    badgeScale.value = withSequence(
      withTiming(1.08, { duration: 360, easing: Easing.out(Easing.back(1.6)) }),
      withTiming(1, { duration: 200 }),
    );
  }, [badgeScale]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View
      style={[
        styles.root,
        webCenter,
        { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <View style={styles.center}>
        <Animated.View style={[styles.halo, badgeStyle]}>
          <View style={styles.badge}>
            <PathMark size={80} color={colors.card} accent={colors.accent} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.text}>
          <AppText variant="hero" align="center" style={styles.title}>
            Resan med {name} börjar
          </AppText>
          <AppText variant="bodyStrong" color={colors.primary} align="center">
            {homeLabel} · {name} är {puppyAgeWeeks} veckor
          </AppText>
          <AppText variant="body" color={colors.textMuted} align="center">
            Nu tar ni första stegen hemma tillsammans, en vecka i taget.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(500).duration(500)}>
        <AppButton
          label={`Till resan med ${name}`}
          onPress={() => router.replace('/(tabs)/today')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xxl },
  halo: {
    width: 196,
    height: 196,
    borderRadius: 98,
    backgroundColor: colors.surfaceSage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { gap: spacing.md, paddingHorizontal: spacing.md },
  title: {},
});
