import { StyleSheet, View } from 'react-native';
import { AppText, IconCircle, type IoniconName } from '@/components';
import type { NativeOffer } from '@/types';
import { colors, radius, spacing } from '@/theme';

interface NativeOfferCardProps {
  offer: NativeOffer;
}

/**
 * Lifecycle-based recommendation placeholder. Helpful, calm, clearly marked as
 * an example — never a loud ad. No real affiliate links.
 */
export function NativeOfferCard({ offer }: NativeOfferCardProps) {
  return (
    <View style={styles.card}>
      <IconCircle name={offer.icon as IoniconName} size={48} />
      <View style={styles.text}>
        <AppText variant="overline" color={colors.accent}>
          {offer.category.toUpperCase()}
        </AppText>
        <AppText variant="bodyStrong" style={styles.title}>
          {offer.title}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {offer.description}
        </AppText>
        <View style={styles.tag}>
          <AppText variant="overline" color={colors.textMuted}>
            PARTNERPLATS · EXEMPEL
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  text: { flexShrink: 1, flex: 1, gap: 2 },
  title: { marginTop: 2 },
  tag: { marginTop: spacing.sm },
});
