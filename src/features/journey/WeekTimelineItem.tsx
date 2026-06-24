import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppText } from '@/components';
import { WeeklyGuideCard } from './WeeklyGuideCard';
import type { WeeklyGuide } from '@/types';
import { colors, radius, spacing } from '@/theme';

interface WeekTimelineItemProps {
  guide: WeeklyGuide;
  /** Is this the puppy's current week? */
  isCurrent: boolean;
  /** Is this the last item in the timeline (hides the connecting line)? */
  isLast: boolean;
}

/**
 * One week on the journey timeline. Available weeks (8–16) expand to the full
 * guide; future weeks show a calm "Kommer snart" placeholder.
 */
export function WeekTimelineItem({ guide, isCurrent, isLast }: WeekTimelineItemProps) {
  const [expanded, setExpanded] = useState(isCurrent);

  return (
    <View style={styles.row}>
      {/* Rail */}
      <View style={styles.rail}>
        <View
          style={[
            styles.node,
            guide.available ? styles.nodeActive : styles.nodeLocked,
            isCurrent && styles.nodeCurrent,
          ]}
        >
          <AppText
            variant="overline"
            color={guide.available ? colors.white : colors.textMuted}
          >
            {guide.weekNumber}
          </AppText>
        </View>
        {!isLast ? <View style={styles.line} /> : null}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isCurrent ? (
          <AppText variant="overline" color={colors.accent} style={styles.badge}>
            NUVARANDE VECKA
          </AppText>
        ) : null}

        {guide.available ? (
          <Pressable onPress={() => setExpanded((v) => !v)}>
            {expanded ? (
              <Animated.View entering={FadeIn.duration(300)}>
                <WeeklyGuideCard guide={guide} variant="full" />
              </Animated.View>
            ) : (
              <View style={styles.collapsed}>
                <AppText variant="bodyStrong">{guide.title}</AppText>
                <AppText
                  variant="caption"
                  color={colors.textMuted}
                  numberOfLines={2}
                  style={styles.collapsedSummary}
                >
                  {guide.summary}
                </AppText>
                <AppText variant="caption" color={colors.primary} style={styles.more}>
                  Läs veckan ›
                </AppText>
              </View>
            )}
          </Pressable>
        ) : (
          <View style={styles.locked}>
            <AppText variant="bodyStrong" color={colors.textMuted}>
              Vecka {guide.weekNumber}
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              Kommer snart
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}

const NODE = 36;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', width: NODE },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActive: { backgroundColor: colors.primary },
  nodeLocked: { backgroundColor: colors.card, borderWidth: StyleSheet.hairlineWidth * 2, borderColor: colors.border },
  nodeCurrent: { borderWidth: 3, borderColor: colors.accent },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: spacing.xs, minHeight: spacing.lg },
  content: { flex: 1, paddingBottom: spacing.lg },
  badge: { marginBottom: spacing.xs },
  collapsed: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  collapsedSummary: { marginTop: spacing.xs },
  more: { marginTop: spacing.sm },
  locked: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: 2,
  },
});
