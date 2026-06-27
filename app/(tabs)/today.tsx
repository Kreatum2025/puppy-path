import { AppText, ScreenContainer } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { HomeHeader } from '@/features/home/HomeHeader';
import { ContentCard } from '@/features/home/ContentCard';
import { homeWeekLabel } from '@/lib/week';
import { getHomeContentForWeek, breedNoteFor } from '@/data/homeContent';
import { spacing } from '@/theme';

/**
 * D2 home screen: the start of a journey, not a dashboard. Shows the homecoming
 * phase + one main card at a time (weekly_development, daily_goal, reassurance,
 * breed_note) from D1's time model. Growth/log/progress/digest/partner cards
 * still exist in the codebase and return in their own slices (D3+).
 */
export default function TodayScreen() {
  const { loading, puppy, puppyAgeWeeks, homeWeekIndex } = usePuppy();

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
        <ContentCard
          title={content.dailyGoal.title}
          body={content.dailyGoal.body}
          cta={content.dailyGoal.cta}
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
  );
}
