import { StyleSheet, View } from 'react-native';
import { AppCard, AppText } from '@/components';
import type { WeeklyGuide } from '@/types';
import { colors, radius, spacing } from '@/theme';

interface WeeklyGuideCardProps {
  guide: WeeklyGuide;
  /** 'summary' = compact (Today). 'full' = all sections + checklist. */
  variant?: 'summary' | 'full';
}

function FocusList({ points }: { points: string[] }) {
  return (
    <View style={styles.focusList}>
      {points.map((p) => (
        <View key={p} style={styles.focusItem}>
          <View style={styles.focusDot} />
          <AppText variant="body" style={styles.focusText}>
            {p}
          </AppText>
        </View>
      ))}
    </View>
  );
}

/** Calm weekly development guide. Summary on Today, full on the Journey screen. */
export function WeeklyGuideCard({ guide, variant = 'summary' }: WeeklyGuideCardProps) {
  return (
    <AppCard padding="md">
      <AppText variant="overline" color={colors.accent}>
        DEN HÄR VECKAN
      </AppText>
      <AppText variant="heading" style={styles.title}>
        {guide.title}
      </AppText>
      <AppText variant="body" color={colors.text} style={styles.summary}>
        {guide.summary}
      </AppText>

      {variant === 'full' && guide.bodyBrain ? (
        <Section heading="Kropp och hjärna" body={guide.bodyBrain} />
      ) : null}
      {variant === 'full' && guide.behaviorNote ? (
        <Section heading="Beteende" body={guide.behaviorNote} />
      ) : null}

      {guide.focusPoints.length > 0 ? (
        <View style={styles.block}>
          <AppText variant="label" color={colors.textMuted} style={styles.blockLabel}>
            VECKANS FOKUS
          </AppText>
          <FocusList points={guide.focusPoints} />
        </View>
      ) : null}

      {variant === 'full' && guide.checklist.length > 0 ? (
        <View style={styles.block}>
          <AppText variant="label" color={colors.textMuted} style={styles.blockLabel}>
            CHECKLISTA
          </AppText>
          <View style={styles.focusList}>
            {guide.checklist.map((c) => (
              <View key={c} style={styles.checkItem}>
                <AppText style={styles.checkBox}>○</AppText>
                <AppText variant="body" style={styles.focusText}>
                  {c}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {variant === 'full' ? (
        <View style={styles.disclaimer}>
          <AppText variant="caption" color={colors.textMuted}>
            {guide.disclaimer}
          </AppText>
        </View>
      ) : null}
    </AppCard>
  );
}

function Section({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={styles.block}>
      <AppText variant="label" color={colors.textMuted} style={styles.blockLabel}>
        {heading.toUpperCase()}
      </AppText>
      <AppText variant="body" color={colors.text}>
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: spacing.xs, marginBottom: spacing.sm },
  summary: {},
  block: { marginTop: spacing.lg },
  blockLabel: { marginBottom: spacing.sm },
  focusList: { gap: spacing.sm },
  focusItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  focusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  focusText: { flexShrink: 1 },
  checkItem: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  checkBox: { color: colors.sage, fontSize: 16, lineHeight: 22 },
  disclaimer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
    borderRadius: radius.sm,
  },
});
