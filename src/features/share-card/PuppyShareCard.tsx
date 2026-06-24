import { Image, StyleSheet, View } from 'react-native';
import { AppText, PathMark } from '@/components';
import type { GrowthLog, Puppy, ShareCardTheme } from '@/types';
import { ageInWeeks } from '@/lib/week';
import { radius, spacing } from '@/theme';

interface PuppyShareCardProps {
  puppy: Puppy;
  growth: GrowthLog | null;
  milestone: string | null;
  challenge: string | null;
  caption: string;
  theme: ShareCardTheme;
}

function fmtWeight(kg: number | null | undefined): string {
  return kg == null ? 'Ej angett' : `${kg.toString().replace('.', ',')} kg`;
}
function fmtHeight(cm: number | null | undefined): string {
  return cm == null ? 'Ej angett' : `${cm} cm`;
}

/**
 * The weekly share card — designed to feel like an Instagram story, a baby
 * milestone card and a premium memory card combined. Themed via ShareCardTheme.
 *
 * TODO (later): implement image export with react-native-view-shot and
 * expo-sharing so this card can be shared/saved as an image.
 */
export function PuppyShareCard({
  puppy,
  growth,
  milestone,
  challenge,
  caption,
  theme,
}: PuppyShareCardProps) {
  const weeks = ageInWeeks(puppy.dateOfBirth);

  return (
    <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}>
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

      {/* Identity */}
      <AppText variant="hero" color={theme.text} style={styles.name}>
        {puppy.name}, {weeks} veckor
      </AppText>
      <AppText variant="body" color={theme.textMuted} style={styles.breed}>
        {puppy.breedName}
      </AppText>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={[styles.stat, { borderColor: theme.border }]}>
          <AppText variant="overline" color={theme.textMuted}>
            VIKT
          </AppText>
          <AppText variant="heading" color={theme.text}>
            {fmtWeight(growth?.weightKg)}
          </AppText>
        </View>
        <View style={[styles.stat, { borderColor: theme.border }]}>
          <AppText variant="overline" color={theme.textMuted}>
            MANKHÖJD
          </AppText>
          <AppText variant="heading" color={theme.text}>
            {fmtHeight(growth?.withersHeightCm)}
          </AppText>
        </View>
      </View>

      {/* Milestone & challenge */}
      <View style={styles.lines}>
        <Line label="Veckans milstolpe" value={milestone ?? 'Inte loggad än'} theme={theme} />
        <Line label="Veckans utmaning" value={challenge ?? 'Inte loggad än'} theme={theme} />
      </View>

      {/* Caption */}
      <View style={[styles.captionWrap, { borderTopColor: theme.border }]}>
        <AppText variant="body" color={theme.text} style={styles.caption}>
          {caption}
        </AppText>
      </View>

      {/* Branding */}
      <AppText variant="overline" color={theme.textMuted} style={styles.madeWith}>
        MADE WITH PUPPYJOURNEY
      </AppText>
    </View>
  );
}

function Line({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ShareCardTheme;
}) {
  return (
    <View style={styles.line}>
      <View style={[styles.dot, { backgroundColor: theme.accent }]} />
      <AppText variant="body" color={theme.textMuted}>
        {label}:{' '}
        <AppText variant="bodyStrong" color={theme.text}>
          {value}
        </AppText>
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
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
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
  name: { marginBottom: spacing.xs },
  breed: { marginBottom: spacing.lg },
  stats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  stat: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  lines: { gap: spacing.sm },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 7, height: 7, borderRadius: 4 },
  captionWrap: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth * 2 },
  caption: { fontStyle: 'italic' },
  madeWith: { marginTop: spacing.lg, textAlign: 'center' },
});
