import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  AppButton,
  AppText,
  ScreenContainer,
  SectionTitle,
  Toast,
} from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { PuppyProfileCard } from '@/features/puppy/PuppyProfileCard';
import { GrowthSummaryCard } from '@/features/growth/GrowthSummaryCard';
import { WeeklyProgressCard } from '@/features/today/WeeklyProgressCard';
import { LogActionsCard } from '@/features/today/LogActionsCard';
import { WeeklyGuideCard } from '@/features/journey/WeeklyGuideCard';
import { WeeklyDigestPlaceholder } from '@/features/ai/WeeklyDigestPlaceholder';
import { PartnerSlot } from '@/features/offers/PartnerSlot';
import { getGuideForWeek } from '@/services/journeyService';
import { getWeeklyDigest } from '@/services/digestService';
import { getWeeklyPartnerExample } from '@/services/offerService';
import type { WeeklyDigest, WeeklyGuide } from '@/types';
import { spacing } from '@/theme';

export default function TodayScreen() {
  const router = useRouter();
  const { loading, puppy, latestGrowth, week, weeklyProgress, completedCount } = usePuppy();

  const [guide, setGuide] = useState<WeeklyGuide | null>(null);
  const [digest, setDigest] = useState<WeeklyDigest | null>(null);
  const [partner, setPartner] = useState<{ title: string; body: string; label: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!week) return;
    getGuideForWeek(week).then(setGuide);
    getWeeklyDigest(week).then(setDigest);
    getWeeklyPartnerExample().then(setPartner);
  }, [week]);

  const showToast = useCallback((message: string) => setToast(message), []);

  if (loading || !puppy) {
    return (
      <ScreenContainer scroll={false}>
        <AppText variant="body" color="#6E7A72">
          Laddar…
        </AppText>
      </ScreenContainer>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer contentContainerStyle={{ gap: spacing.lg }}>
        <PuppyProfileCard puppy={puppy} week={week} />
        <GrowthSummaryCard growth={latestGrowth} />

        <WeeklyProgressCard
          puppyName={puppy.name}
          week={week}
          progress={weeklyProgress}
          completedCount={completedCount}
        />

        <LogActionsCard onLogged={showToast} />

        {guide ? <WeeklyGuideCard guide={guide} variant="summary" /> : null}

        {digest ? <WeeklyDigestPlaceholder digest={digest} /> : null}

        {/* Share weekly card CTA */}
        <View>
          <SectionTitle title="Veckans kort" />
          <AppButton
            label="Skapa veckans delningskort"
            leading={<Ionicons name="share-outline" size={18} color="#FFFFFF" />}
            onPress={() => router.push('/modal/share-card')}
          />
        </View>

        {partner ? (
          <PartnerSlot title={partner.title} body={partner.body} label={partner.label} />
        ) : null}
      </ScreenContainer>

      <Toast message={toast} onHide={() => setToast(null)} />
    </View>
  );
}
