import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppCard, AppText } from '@/components';
import { colors, spacing } from '@/theme';

interface DailyGoalCardProps {
  title: string;
  body: string;
  cta?: string;
  puppyName: string;
  /** Offered after completion. The memory itself is built in D4. */
  onSaveMemory: () => void;
  delay?: number;
}

/**
 * Dagens lilla mål - en del av valpens resa, inte en tracker. Att markera som
 * gjort ger en varm bekräftelse (ingen streak, ingen press) och erbjuder att
 * spara stunden som ett minne. Completion är lokal sessionsstate.
 */
export function DailyGoalCard({
  title,
  body,
  cta = 'Markera som gjort',
  puppyName,
  onSaveMemory,
  delay = 0,
}: DailyGoalCardProps) {
  const [done, setDone] = useState(false);

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)}>
      <AppCard padding="md">
        <AppText variant="bodyStrong" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          {body}
        </AppText>

        {!done ? (
          <View style={styles.cta}>
            <AppButton
              label={cta}
              variant="secondary"
              size="md"
              fullWidth={false}
              onPress={() => setDone(true)}
            />
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(350)} style={styles.doneBox}>
            <View style={styles.doneRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              <AppText variant="bodyStrong" color={colors.primary}>
                Ni klarade dagens mål tillsammans
              </AppText>
            </View>
            <AppText variant="body" color={colors.textMuted}>
              {`${puppyName} tog ett litet steg idag. Vill du spara det här som ett minne i resan med ${puppyName}?`}
            </AppText>
            <View style={styles.cta}>
              <AppButton
                label="Spara som minne"
                variant="secondary"
                size="md"
                fullWidth={false}
                onPress={onSaveMemory}
              />
            </View>
          </Animated.View>
        )}
      </AppCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  cta: { marginTop: spacing.lg },
  doneBox: { marginTop: spacing.lg, gap: spacing.sm },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
