import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingScaffold } from '@/features/onboarding/OnboardingScaffold';
import { usePuppy } from '@/context/PuppyContext';
import { colors, radius, spacing, type as typePresets } from '@/theme';

const TOTAL_STEPS = 6;

export default function PuppyNameStep() {
  const router = useRouter();
  const { draft, updateDraft } = usePuppy();
  const [name, setName] = useState(draft.name);

  const trimmed = name.trim();

  return (
    <OnboardingScaffold
      stepIndex={0}
      totalSteps={TOTAL_STEPS}
      title="Vad heter din valp?"
      subtitle="Namnet följer med genom hela resan."
      nextDisabled={trimmed.length === 0}
      onBack={() => router.back()}
      onNext={() => {
        updateDraft({ name: trimmed });
        router.push('/onboarding/breed');
      }}
    >
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="t.ex. Luna"
        placeholderTextColor={colors.textMuted}
        autoFocus
        returnKeyType="next"
        style={styles.input}
        maxLength={24}
      />
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typePresets.heading,
    color: colors.text,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});
