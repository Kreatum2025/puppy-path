import { Image, StyleSheet, View } from 'react-native';
import { AppText, PathMark } from '@/components';
import type { Memory, Puppy, ShareCardTheme } from '@/types';
import { radius, spacing } from '@/theme';

interface MemoryShareCardProps {
  puppy: Puppy;
  memory: Memory;
  theme: ShareCardTheme;
}

/**
 * A saved memory rendered as a shareable card - the puppy's first chapter told
 * as a moment, not statistics. Preview only (D5a); image export comes later.
 */
export function MemoryShareCard({ puppy, memory, theme }: MemoryShareCardProps) {
  return (
    <View
      style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}
    >
      {/* Brand row */}
      <View style={styles.brandRow}>
        <PathMark size={22} color={theme.text} accent={theme.accent} />
        <AppText variant="overline" color={theme.textMuted}>
          PUPPYJOURNEY
        </AppText>
      </View>

      {/* Photo */}
      <View style={[styles.photo, { backgroundColor: theme.photoBackground }]}>
        {puppy.photoUri ? (
          <Image source={{ uri: puppy.photoUri }} style={styles.photoImage} />
        ) : (
          <PathMark size={64} color={theme.text} accent={theme.accent} />
        )}
      </View>

      {/* Chapter */}
      <AppText variant="overline" color={theme.textMuted} style={styles.chapter}>
        FÖRSTA KAPITLET
      </AppText>

      {/* Identity */}
      <AppText variant="hero" color={theme.text} style={styles.name}>
        {puppy.name}
      </AppText>
      <AppText variant="bodyStrong" color={theme.text} style={styles.phase}>
        {memory.homeWeekLabel}
      </AppText>
      <AppText variant="body" color={theme.textMuted} style={styles.age}>
        {`${puppy.name} är ${memory.puppyAgeWeeks} veckor`}
      </AppText>

      {/* Memory text */}
      <View style={[styles.memoryWrap, { borderTopColor: theme.border }]}>
        <AppText variant="body" color={theme.text} style={styles.memoryText}>
          {memory.text}
        </AppText>
      </View>

      {/* Tagline + branding */}
      <AppText variant="bodyStrong" color={theme.text} style={styles.tagline}>
        Ett litet steg tillsammans
      </AppText>
      <AppText variant="overline" color={theme.textMuted} style={styles.brand}>
        Skapat i PuppyJourney
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  chapter: { marginBottom: spacing.xs },
  name: { marginBottom: spacing.xs },
  phase: { marginBottom: spacing.xs },
  age: { marginBottom: spacing.lg },
  memoryWrap: { paddingTop: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth * 2 },
  memoryText: { fontStyle: 'italic' },
  tagline: { marginTop: spacing.lg },
  brand: { marginTop: spacing.xs },
});
