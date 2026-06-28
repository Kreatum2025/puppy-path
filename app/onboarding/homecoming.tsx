import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScaffold } from '@/features/onboarding/OnboardingScaffold';
import { AppCard, AppText } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { subDays, toISODate, formatSwedishDate } from '@/lib/dates';
import { colors, radius, spacing } from '@/theme';

const TOTAL_STEPS = 6;

// Hemkomst väljs ungefärligt via chips (ingen tung date-picker-dependency).
const OPTIONS: { label: string; days: number }[] = [
  { label: 'Idag', days: 0 },
  { label: 'I går', days: 1 },
  { label: 'För några dagar sedan', days: 3 },
  { label: 'För 1 vecka sedan', days: 7 },
  { label: 'För 2 veckor sedan', days: 14 },
];

/**
 * Homecoming step. Sets the homecoming date, which drives home_week_index (the
 * emotional journey), separate from biological age. The journey starts here.
 */
export default function HomecomingStep() {
  const router = useRouter();
  const { updateDraft } = usePuppy();

  const [days, setDays] = useState(0);
  const homecomingDate = toISODate(subDays(new Date(), days));

  return (
    <OnboardingScaffold
      stepIndex={3}
      totalSteps={TOTAL_STEPS}
      title="När kom valpen hem till dig?"
      subtitle="Det datumet blir början på er resa tillsammans."
      onBack={() => router.back()}
      onNext={() => {
        updateDraft({ homecomingDate });
        router.push('/onboarding/before-home');
      }}
    >
      <AppCard variant="secondary" padding="md" style={styles.story}>
        <AppText variant="body" color={colors.text}>
          Första tiden hemma handlar mest om trygghet, vila och att lära känna
          varandra.
        </AppText>
      </AppCard>

      <View style={styles.list}>
        {OPTIONS.map((o) => {
          const active = o.days === days;
          return (
            <Pressable
              key={o.label}
              onPress={() => setDays(o.days)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <AppText variant="bodyStrong" color={active ? colors.white : colors.text}>
                {o.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.note}>
        <AppText variant="caption" color={colors.textMuted}>
          Hemkomstdatum: {formatSwedishDate(homecomingDate)}
        </AppText>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  story: { marginBottom: spacing.xl },
  list: { gap: spacing.sm },
  chip: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  note: { marginTop: spacing.xl },
});
