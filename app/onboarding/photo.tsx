import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { OnboardingScaffold } from '@/features/onboarding/OnboardingScaffold';
import { AppText } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { colors, spacing } from '@/theme';

const TOTAL_STEPS = 6;

/**
 * Photo step — placeholder only. No image picker dependency yet; tapping marks
 * the placeholder as chosen so the flow feels alive without faking a real
 * image. A real picker (expo-image-picker) is added in a later step.
 */
export default function PhotoStep() {
  const router = useRouter();
  const { draft } = usePuppy();
  const [added, setAdded] = useState<boolean>(draft.photoUri != null);

  return (
    <OnboardingScaffold
      stepIndex={4}
      totalSteps={TOTAL_STEPS}
      title="Lägg till en första bild"
      subtitle="En bild gör profilen personlig direkt. Du kan byta den när som helst."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/measurements')}
      secondary={{ label: 'Lägg till senare', onPress: () => router.push('/onboarding/measurements') }}
      nextLabel={added ? 'Fortsätt' : 'Fortsätt utan bild'}
    >
      <View style={styles.center}>
        <Pressable onPress={() => setAdded((v) => !v)} style={styles.circle}>
          {added ? (
            <Animated.View entering={FadeIn.duration(300)} style={styles.added}>
              <Ionicons name="checkmark-circle" size={44} color={colors.primary} />
              <AppText variant="caption" color={colors.primary}>
                Platshållare vald
              </AppText>
            </Animated.View>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="camera-outline" size={44} color={colors.textMuted} />
              <AppText variant="caption" color={colors.textMuted}>
                Tryck för att lägga till
              </AppText>
            </View>
          )}
        </Pressable>
        <AppText variant="caption" color={colors.textMuted} align="center" style={styles.hint}>
          (Bilduppladdning kopplas in i ett senare steg.)
        </AppText>
      </View>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { alignItems: 'center', gap: spacing.sm },
  added: { alignItems: 'center', gap: spacing.sm },
  hint: { marginTop: spacing.xl },
});
