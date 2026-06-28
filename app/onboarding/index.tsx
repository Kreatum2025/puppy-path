import { Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppCard, AppText, IconCircle, PathMark, type IoniconName } from '@/components';
import { colors, spacing } from '@/theme';

const webCenter: ViewStyle | null =
  Platform.OS === 'web' ? { width: '100%', maxWidth: 560, alignSelf: 'center' } : null;

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
    <View style={[styles.root, webCenter, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Tillbaka"
        style={styles.back}
      >
        <AppText variant="body" color={colors.textMuted}>
          ‹ Tillbaka
        </AppText>
      </Pressable>

      <Animated.View entering={FadeInDown.duration(600)} style={styles.top}>
        <PathMark size={40} color={colors.primary} />
        <AppText variant="title" style={styles.title}>
          Nu börjar valpens resa
        </AppText>
        <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
          Vi skapar en enkel profil så PuppyJourney kan anpassa veckan efter din
          valp.
        </AppText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(600)}>
        <AppCard variant="secondary" padding="md" style={styles.story}>
          <AppText variant="body" color={colors.text}>Det tar ungefär en minut.</AppText>
          <AppText variant="body" color={colors.text}>
            Du kan ändra uppgifterna senare.
          </AppText>
          <AppText variant="body" color={colors.text}>
            Inget konto behövs för att börja.
          </AppText>
        </AppCard>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(600)}>
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
  back: { paddingBottom: spacing.md },
  top: { alignItems: 'flex-start', marginBottom: spacing.xl },
  story: { marginBottom: spacing.lg, gap: spacing.xs },
  title: { marginTop: spacing.lg, marginBottom: spacing.sm },
  subtitle: {},
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  stepDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  spacer: { flex: 1, minHeight: spacing.xl },
});
