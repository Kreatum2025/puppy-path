import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components';
import type { Memory } from '@/types';
import { toISODate, formatSwedishDate } from '@/lib/dates';
import { colors, spacing } from '@/theme';

interface MemoryCardProps {
  memory: Memory;
  puppyName: string;
}

/**
 * A single memory in the puppy's journey, told as a small moment (not a data
 * row). Metadata reads as context: "Första veckan hemma · Luna är 10 veckor ·
 * Sparat idag".
 */
export function MemoryCard({ memory, puppyName }: MemoryCardProps) {
  const today = toISODate(new Date());
  const when =
    memory.createdAt === today
      ? 'Sparat idag'
      : `Sparat ${formatSwedishDate(memory.createdAt)}`;

  return (
    <View style={styles.root}>
      <AppText variant="body">{memory.text}</AppText>
      <AppText variant="caption" color={colors.textMuted}>
        {`${memory.homeWeekLabel} · ${puppyName} är ${memory.puppyAgeWeeks} veckor · ${when}`}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.xs },
});
