import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components';
import type { WeeklyDigest } from '@/types';
import { colors, radius, spacing } from '@/theme';

interface WeeklyDigestPlaceholderProps {
  digest: WeeklyDigest;
}

/**
 * AI Weekly Digest — PLACEHOLDER ONLY. No real AI. Reads digest.generated to
 * stay honest: while false, it explains what the summary will become once the
 * owner logs their own data.
 */
export function WeeklyDigestPlaceholder({ digest }: WeeklyDigestPlaceholderProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles-outline" size={18} color={colors.primaryDeep} />
        </View>
        <View style={styles.headerText}>
          <AppText variant="bodyStrong" color={colors.white}>
            Veckans sammanfattning
          </AppText>
          <AppText variant="overline" color={colors.sage}>
            PERSONLIG AI · KOMMER SNART
          </AppText>
        </View>
      </View>

      <AppText variant="body" color="rgba(255,249,239,0.88)" style={styles.body}>
        {digest.caption}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primaryDeep,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { gap: 2 },
  body: {},
});
