import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScaffold } from '@/features/onboarding/OnboardingScaffold';
import { AppText } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { subDays, toISODate, formatSwedishDate } from '@/lib/dates';
import { ageInWeeks } from '@/lib/week';
import { colors, radius, spacing } from '@/theme';

const TOTAL_STEPS = 6;
// Biologisk ålder i veckor. Närmare spridning tidigt (8-14 v) där de flesta
// valpar kommer hem, sedan bredare steg.
const WEEK_OPTIONS = [8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 24, 30, 36, 44, 52];

/**
 * Prototype age picker: pick an approximate age in weeks, which we convert to a
 * date of birth. Avoids a heavy date-picker dependency while still storing the
 * real DOB the data model expects.
 */
export default function BirthdateStep() {
  const router = useRouter();
  const { draft, updateDraft } = usePuppy();

  const initialWeeks = draft.dateOfBirth ? ageInWeeks(draft.dateOfBirth) : 12;
  const [weeks, setWeeks] = useState<number>(
    WEEK_OPTIONS.includes(initialWeeks) ? initialWeeks : 12,
  );

  const dob = toISODate(subDays(new Date(), weeks * 7));

  return (
    <OnboardingScaffold
      stepIndex={2}
      totalSteps={TOTAL_STEPS}
      title="Hur gammal är din valp?"
      subtitle="Ungefärlig ålder räcker. Vi använder den för att visa rätt utvecklingsfas."
      onBack={() => router.back()}
      onNext={() => {
        updateDraft({ dateOfBirth: dob });
        router.push('/onboarding/homecoming');
      }}
    >
      <View style={styles.grid}>
        {WEEK_OPTIONS.map((w) => {
          const active = w === weeks;
          return (
            <Pressable
              key={w}
              onPress={() => setWeeks(w)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <AppText
                variant="bodyStrong"
                color={active ? colors.white : colors.text}
              >
                {w} v
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.note}>
        <AppText variant="caption" color={colors.textMuted}>
          Beräknat födelsedatum: {formatSwedishDate(dob)}
        </AppText>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minWidth: 64,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  note: { marginTop: spacing.xl },
});
