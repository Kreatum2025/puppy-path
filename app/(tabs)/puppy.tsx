import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { ageInWeeks, homeWeekLabel } from '@/lib/week';
import { formatSwedishDate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

function formatWeight(kg: number | null | undefined): string {
  return kg != null ? `${String(kg).replace('.', ',')} kg` : 'Inte sparat ännu';
}
function formatHeight(cm: number | null | undefined): string {
  return cm != null ? `${cm} cm` : 'Inte sparat ännu';
}

export default function PuppyProfileScreen() {
  const { puppy, latestGrowth, growthHistory, milestones, challenges, memories, homeWeekIndex } =
    usePuppy();
  const router = useRouter();

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
  const homeLabel = homeWeekLabel(homeWeekIndex);

  return (
    <ScreenContainer contentContainerStyle={{ gap: spacing.lg }}>
      {/* Profile hero */}
      <AppCard variant="secondary" padding="lg">
        <View style={styles.identity}>
          <PuppyAvatar uri={puppy.photoUri} size={104} />
          <AppText variant="overline" color={colors.moss}>
            {homeLabel}
          </AppText>
          <AppText variant="title" style={styles.name}>
            {puppy.name}
          </AppText>
          <AppText variant="body" color={colors.textMuted}>
            {puppy.breedName} · {weeks} veckor
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.hint}>
            Valpens resa växer fram här.
          </AppText>
        </View>
      </AppCard>

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
              text="Lägg till din första milstolpe från Idag."
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
              text="Inga utmaningar sparade än. De dyker upp här när du sparar veckans utmaning."
            />
          )}
        </AppCard>
      </View>

      {/* Memory book - the puppy's first chapter */}
      <View>
        <SectionTitle title="Första kapitlet" />
        <AppCard padding="md" background={colors.surfaceSage}>
          {memories.length > 0 ? (
            memories.map((m, i) => (
              <View key={m.id} style={i > 0 ? styles.divider : undefined}>
                <MemoryCard
                  memory={m}
                  puppyName={puppy.name}
                  onShowCard={() =>
                    router.push(`/modal/memory-card?memoryId=${m.id}`)
                  }
                />
              </View>
            ))
          ) : (
            <View style={styles.chapterEmpty}>
              <AppText variant="bodyStrong" color={colors.text}>
                Första kapitlet väntar
              </AppText>
              <AppText variant="body" color={colors.textMuted}>
                Spara ett litet minne från Idag så börjar minnesboken växa fram.
              </AppText>
            </View>
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
  identity: { alignItems: 'center', gap: spacing.xs },
  name: { marginTop: spacing.xs },
  hint: { marginTop: spacing.xs },
  chapterEmpty: { gap: spacing.xs },
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
