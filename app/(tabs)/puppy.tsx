import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AppCard,
  AppText,
  PuppyAvatar,
  ScreenContainer,
  SectionTitle,
  StatPill,
  type IoniconName,
} from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { GrowthChartCard } from '@/features/growth/GrowthChartCard';
import { MilestoneCard } from '@/features/milestones/MilestoneCard';
import { ChallengeCard } from '@/features/challenges/ChallengeCard';
import { MemoryCard } from '@/features/memories/MemoryCard';
import { ageInWeeks } from '@/lib/week';
import { formatSwedishDate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

function formatWeight(kg: number | null | undefined): string {
  return kg != null ? `${String(kg).replace('.', ',')} kg` : 'Ej angett';
}
function formatHeight(cm: number | null | undefined): string {
  return cm != null ? `${cm} cm` : 'Ej angett';
}

export default function PuppyProfileScreen() {
  const { puppy, latestGrowth, growthHistory, milestones, challenges, memories } =
    usePuppy();

  if (!puppy) {
    return (
      <ScreenContainer scroll={false}>
        <AppText variant="body" color={colors.textMuted}>
          Ingen valp ännu.
        </AppText>
      </ScreenContainer>
    );
  }

  const weeks = ageInWeeks(puppy.dateOfBirth);

  return (
    <ScreenContainer contentContainerStyle={{ gap: spacing.lg }}>
      {/* Identity */}
      <View style={styles.identity}>
        <PuppyAvatar uri={puppy.photoUri} size={120} />
        <AppText variant="title" style={styles.name}>
          {puppy.name}
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          {puppy.breedName} · {weeks} veckor
        </AppText>
      </View>

      {/* Facts */}
      <AppCard padding="md">
        <View style={styles.factsRow}>
          <StatPill label="Ålder" value={`${weeks} v`} icon="calendar-outline" style={styles.fact} />
          <StatPill
            label="Född"
            value={formatSwedishDate(puppy.dateOfBirth)}
            icon="calendar-clear-outline"
            style={styles.fact}
          />
        </View>
        <View style={[styles.factsRow, styles.factsRowGap]}>
          <StatPill
            label="Vikt"
            value={formatWeight(latestGrowth?.weightKg)}
            icon="barbell-outline"
            style={styles.fact}
            tone="sage"
          />
          <StatPill
            label="Mankhöjd"
            value={formatHeight(latestGrowth?.withersHeightCm)}
            icon="resize-outline"
            style={styles.fact}
            tone="sage"
          />
        </View>
      </AppCard>

      {/* Growth chart */}
      <GrowthChartCard history={growthHistory} dateOfBirth={puppy.dateOfBirth} />

      {/* Milestones */}
      <View>
        <SectionTitle title="Milstolpar" />
        <AppCard padding="md">
          {milestones.length > 0 ? (
            milestones.map((m, i) => (
              <View key={m.id} style={i > 0 ? styles.divider : undefined}>
                <MilestoneCard milestone={m} />
              </View>
            ))
          ) : (
            <EmptyRow
              icon="ribbon-outline"
              text="Inga milstolpar än. Logga din första på Idag-fliken."
            />
          )}
        </AppCard>
      </View>

      {/* Challenges */}
      <View>
        <SectionTitle title="Utmaningar" />
        <AppCard padding="md">
          {challenges.length > 0 ? (
            challenges.map((c, i) => (
              <View key={c.id} style={i > 0 ? styles.divider : undefined}>
                <ChallengeCard challenge={c} />
              </View>
            ))
          ) : (
            <EmptyRow
              icon="paw-outline"
              text="Inga utmaningar loggade än. Det dyker upp här när du loggar veckans utmaning."
            />
          )}
        </AppCard>
      </View>

      {/* Memory book - the puppy's first chapter */}
      <View>
        <SectionTitle title="Första kapitlet" />
        <AppCard padding="md">
          {memories.length > 0 ? (
            memories.map((m, i) => (
              <View key={m.id} style={i > 0 ? styles.divider : undefined}>
                <MemoryCard memory={m} puppyName={puppy.name} />
              </View>
            ))
          ) : (
            <EmptyRow
              icon="bookmark-outline"
              text="Här växer valpens första kapitel fram. Spara ditt första minne från Idag-fliken."
            />
          )}
        </AppCard>
      </View>
    </ScreenContainer>
  );
}

function EmptyRow({ icon, text }: { icon: IoniconName; text: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={20} color={colors.sage} />
      <AppText variant="body" color={colors.textMuted} style={styles.emptyText}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm },
  name: { marginTop: spacing.sm },
  factsRow: { flexDirection: 'row', gap: spacing.md },
  factsRowGap: { marginTop: spacing.md },
  fact: { flex: 1 },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
  },
  empty: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  emptyText: { flexShrink: 1 },
});
