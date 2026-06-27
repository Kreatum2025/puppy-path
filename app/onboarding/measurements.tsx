import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScaffold } from '@/features/onboarding/OnboardingScaffold';
import { AppText } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { colors, radius, spacing, type as typePresets } from '@/theme';

const TOTAL_STEPS = 6;

/** Parse a Swedish-style number ("7,4" or "7.4") into a number or null. */
function parseNumber(input: string): number | null {
  const normalised = input.replace(',', '.').trim();
  if (normalised === '') return null;
  const value = Number(normalised);
  return Number.isFinite(value) ? value : null;
}

export default function MeasurementsStep() {
  const router = useRouter();
  const { draft, updateDraft, commitOnboarding } = usePuppy();
  const [weight, setWeight] = useState(draft.weightKg != null ? String(draft.weightKg) : '');
  const [height, setHeight] = useState(
    draft.withersHeightCm != null ? String(draft.withersHeightCm) : '',
  );

  const finish = () => {
    updateDraft({
      weightKg: parseNumber(weight),
      withersHeightCm: parseNumber(height),
    });
    commitOnboarding();
    router.replace('/onboarding/done');
  };

  return (
    <OnboardingScaffold
      stepIndex={5}
      totalSteps={TOTAL_STEPS}
      title="Vikt och mankhöjd"
      subtitle="Helt valfritt. Du kan logga detta varje vecka senare."
      nextLabel="Skapa profil"
      onBack={() => router.back()}
      onNext={finish}
      secondary={{ label: 'Hoppa över', onPress: finish }}
    >
      <View style={styles.fields}>
        <View style={styles.field}>
          <AppText variant="label" color={colors.textMuted}>
            VIKT (KG)
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="7,4"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <AppText variant="body" color={colors.textMuted}>
              kg
            </AppText>
          </View>
        </View>

        <View style={styles.field}>
          <AppText variant="label" color={colors.textMuted}>
            MANKHÖJD (CM)
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="32"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              style={styles.input}
            />
            <AppText variant="body" color={colors.textMuted}>
              cm
            </AppText>
          </View>
        </View>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  fields: { gap: spacing.xl },
  field: { gap: spacing.sm },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  input: { ...typePresets.heading, color: colors.text, flex: 1, paddingVertical: spacing.xs },
});
