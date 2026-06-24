import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppCard, AppText, IconCircle, PathMark, type IoniconName } from '@/components';
import { colors, spacing } from '@/theme';

const STEPS: { icon: IoniconName; label: string }[] = [
  { icon: 'paw-outline', label: 'Namn och ras' },
  { icon: 'calendar-outline', label: 'Ålder' },
  { icon: 'camera-outline', label: 'En första bild' },
  { icon: 'barbell-outline', label: 'Vikt och mankhöjd (valfritt)' },
];

/** Onboarding intro — sets a calm, emotional tone before the steps. */
export default function OnboardingIntro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.top}>
        <PathMark size={56} color={colors.primary} />
        <AppText variant="title" style={styles.title}>
          Nu skapar vi din valps profil
        </AppText>
        <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
          Det tar en minut. Sedan följer ni resan vecka för vecka tillsammans.
        </AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(600)}>
        <AppCard padding="md">
          {STEPS.map((s, i) => (
            <View
              key={s.label}
              style={[styles.step, i < STEPS.length - 1 && styles.stepDivider]}
            >
              <IconCircle name={s.icon} size={40} />
              <AppText variant="bodyStrong">{s.label}</AppText>
            </View>
          ))}
        </AppCard>
      </Animated.View>

      <View style={styles.spacer} />

      <AppButton
        label="Kom igång"
        onPress={() => router.push('/onboarding/puppy-name')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  top: { alignItems: 'flex-start', marginBottom: spacing.xl },
  title: { marginTop: spacing.lg, marginBottom: spacing.sm },
  subtitle: {},
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  stepDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  spacer: { flex: 1, minHeight: spacing.xl },
});
