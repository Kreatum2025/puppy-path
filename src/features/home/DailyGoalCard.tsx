import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppCard, AppText } from '@/components';
import { colors, radius, spacing, type as typePresets } from '@/theme';

interface DailyGoalCardProps {
  title: string;
  body: string;
  cta?: string;
  puppyName: string;
  /** Saves the moment as a memory in the puppy's journey (D4). */
  onSaveMemory: (text: string) => void;
  delay?: number;
}

/**
 * Dagens lilla mål som en del av valpens resa: markera som gjort ger en varm
 * bekräftelse och låter dig spara stunden som ett minne i resan. Ingen press,
 * ingen poäng. Allt är lokal sessionsstate (inget backend).
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [text, setText] = useState('Vi klarade dagens lilla mål tillsammans.');

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
          <View style={styles.action}>
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
            <View style={styles.row}>
              <Ionicons name="heart" size={20} color={colors.primary} />
              <AppText variant="bodyStrong" color={colors.primary}>
                {saved
                  ? 'Minnet är sparat i valpens resa'
                  : 'Ni klarade dagens mål tillsammans'}
              </AppText>
            </View>

            {saved ? (
              <AppText variant="body" color={colors.textMuted}>
                {`Du hittar det i resan med ${puppyName}, under Min valp.`}
              </AppText>
            ) : !saving ? (
              <>
                <AppText variant="body" color={colors.textMuted}>
                  {`${puppyName} tog ett litet steg idag. Vill du spara det här som ett minne i resan med ${puppyName}?`}
                </AppText>
                <View style={styles.action}>
                  <AppButton
                    label="Spara som minne"
                    variant="secondary"
                    size="md"
                    fullWidth={false}
                    onPress={() => setSaving(true)}
                  />
                </View>
              </>
            ) : (
              <View style={styles.saveBox}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Skriv ett minne…"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  multiline
                />
                <View style={styles.saveRow}>
                  <AppButton
                    label="Spara minne"
                    size="md"
                    fullWidth={false}
                    onPress={() => {
                      onSaveMemory(text);
                      setSaved(true);
                      setSaving(false);
                    }}
                  />
                  <AppButton
                    label="Avbryt"
                    variant="ghost"
                    size="md"
                    fullWidth={false}
                    onPress={() => setSaving(false)}
                  />
                </View>
              </View>
            )}
          </Animated.View>
        )}
      </AppCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  action: { marginTop: spacing.lg },
  doneBox: { marginTop: spacing.lg, gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  saveBox: { gap: spacing.md, marginTop: spacing.xs },
  input: {
    ...typePresets.body,
    color: colors.text,
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  saveRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
});
