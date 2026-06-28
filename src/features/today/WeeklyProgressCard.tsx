import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppCard, AppText } from '@/components';
import type { WeeklyProgress } from '@/context/PuppyContext';
import { WEEKLY_TASK_COUNT } from '@/context/PuppyContext';
import { colors, radius, spacing } from '@/theme';

interface WeeklyProgressCardProps {
  puppyName: string;
  week: number;
  progress: WeeklyProgress;
  completedCount: number;
}

const ITEMS: { key: keyof WeeklyProgress; label: string }[] = [
  { key: 'weightLogged', label: 'Vikt loggad' },
  { key: 'heightLogged', label: 'Mankhöjd loggad' },
  { key: 'photoSaved', label: 'Veckans bild sparad' },
  { key: 'milestoneSelected', label: 'Milstolpe vald' },
  { key: 'challengeSelected', label: 'Veckans utmaning vald' },
];

/**
 * Light, warm gamification: shows how many of the five weekly memories are
 * saved, with a gentle "next step" nudge. No streak pressure, no dark patterns.
 */
export function WeeklyProgressCard({
  puppyName,
  week,
  progress,
  completedCount,
}: WeeklyProgressCardProps) {
  const allDone = completedCount === WEEKLY_TASK_COUNT;
  const nextItem = ITEMS.find((i) => !progress[i.key]);

  return (
    <AppCard padding="md">
      <View style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="overline" color={colors.accent}>
            VECKANS RESA
          </AppText>
          <AppText variant="heading">
            Vecka {week} med {puppyName}
          </AppText>
        </View>
        <View style={styles.count}>
          <AppText variant="bodyStrong" color={colors.primary}>
            {completedCount}/{WEEKLY_TASK_COUNT}
          </AppText>
        </View>
      </View>

      {/* Segmented progress */}
      <View style={styles.segments}>
        {ITEMS.map((item, i) => (
          <View
            key={item.key}
            style={[
              styles.segment,
              { backgroundColor: i < completedCount ? colors.primary : colors.border },
            ]}
          />
        ))}
      </View>

      <AppText variant="bodyStrong" color={colors.text} style={styles.statusLine}>
        {allDone
          ? `Veckans resa är klar. Fint jobbat med ${puppyName}!`
          : `${completedCount} av ${WEEKLY_TASK_COUNT} minnen sparade denna vecka`}
      </AppText>

      {/* Checklist */}
      <View style={styles.list}>
        {ITEMS.map((item) => {
          const done = progress[item.key];
          return (
            <View key={item.key} style={styles.item}>
              <Ionicons
                name={done ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={done ? colors.success : colors.border}
              />
              <AppText
                variant="body"
                color={done ? colors.text : colors.textMuted}
                style={done ? styles.itemDone : undefined}
              >
                {item.label}
              </AppText>
            </View>
          );
        })}
      </View>

      {!allDone && nextItem ? (
        <Animated.View entering={FadeIn.duration(400)} style={styles.nudge}>
          <Ionicons name="arrow-forward-circle-outline" size={16} color={colors.accent} />
          <AppText variant="caption" color={colors.textMuted}>
            Nästa lilla steg: {nextItem.label.toLowerCase()}
          </AppText>
        </Animated.View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerText: { gap: 2, flexShrink: 1 },
  count: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  segments: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.lg },
  segment: { flex: 1, height: 8, borderRadius: radius.pill },
  statusLine: { marginTop: spacing.md },
  list: { marginTop: spacing.lg, gap: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  itemDone: {},
  nudge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
  },
});
