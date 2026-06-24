import { useEffect, useState } from 'react';
import { AppHeader, ScreenContainer } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { WeekTimelineItem } from '@/features/journey/WeekTimelineItem';
import { getWeeklyGuides } from '@/services/journeyService';
import type { WeeklyGuide } from '@/types';

export default function JourneyScreen() {
  const { week } = usePuppy();
  const [guides, setGuides] = useState<WeeklyGuide[]>([]);

  useEffect(() => {
    getWeeklyGuides().then(setGuides);
  }, []);

  return (
    <ScreenContainer>
      <AppHeader
        overline="Första året"
        title="Resan, vecka för vecka"
        subtitle="Följ utvecklingen från 8 till 52 veckor. Tryck på en vecka för att läsa mer."
      />

      {guides.map((g, i) => (
        <WeekTimelineItem
          key={g.weekNumber}
          guide={g}
          isCurrent={g.weekNumber === week}
          isLast={i === guides.length - 1}
        />
      ))}
    </ScreenContainer>
  );
}
