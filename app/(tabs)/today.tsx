import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { AppText, ScreenContainer, Toast } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { HomeHeader } from '@/features/home/HomeHeader';
import { ContentCard } from '@/features/home/ContentCard';
import { DailyGoalCard } from '@/features/home/DailyGoalCard';
import { homeWeekLabel } from '@/lib/week';
import { getHomeContentForWeek, breedNoteFor } from '@/data/homeContent';
import { spacing } from '@/theme';

/**
 * Home screen: the start of a journey, not a dashboard. Homecoming phase +
 * biological age (shown separately) and one main card at a time. The daily goal
 * is part of the journey loop (D3): completing it gives warm feedback and offers
 * to save the moment as a memory (the memory itself is built in D4).
 * Growth/log/progress/digest/partner cards stay in the codebase for later slices.
 */
export default function TodayScreen() {
  const { loading, puppy, puppyAgeWeeks, homeWeekIndex } = usePuppy();
  const [toast, setToast] = useState<string | null>(null);
  const onSaveMemory = useCallback(
    () => setToast('Snart kan du spara det här som ett minne i valpens resa.'),
    [],
  );

  if (loading || !puppy) {
    return (
      <ScreenContainer scroll={false}>
        <AppText variant="body" color="#6E7A72">
          Laddar…
        </AppText>
      </ScreenContainer>
    );
  }

  const content = getHomeContentForWeek(homeWeekIndex);
  const breedNote = breedNoteFor(puppy.breedId);

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer contentContainerStyle={{ gap: spacing.lg }}>
        <HomeHeader
          name={puppy.name}
          puppyAgeWeeks={puppyAgeWeeks}
          homeWeekLabel={homeWeekLabel(homeWeekIndex)}
        />

        <ContentCard
          title={content.weekly.title}
          body={content.weekly.body}
          emphasis
          delay={60}
        />

        {content.dailyGoal ? (
          <DailyGoalCard
            title={content.dailyGoal.title}
            body={content.dailyGoal.body}
            cta={content.dailyGoal.cta}
            puppyName={puppy.name}
            onSaveMemory={onSaveMemory}
            delay={120}
          />
        ) : null}

        <ContentCard
          title={content.reassurance.title}
          body={content.reassurance.body}
          delay={180}
        />

        <ContentCard title={breedNote.title} body={breedNote.body} delay={240} />
      </ScreenContainer>

      <Toast message={toast} onHide={() => setToast(null)} />
    </View>
  );
}
