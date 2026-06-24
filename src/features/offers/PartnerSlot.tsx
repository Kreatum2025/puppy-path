import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components';
import { colors, radius, spacing } from '@/theme';

interface PartnerSlotProps {
  title: string;
  body: string;
  label: string;
}

/** The single subtle "Relevant denna vecka" partner example on Today. */
export function PartnerSlot({ title, body, label }: PartnerSlotProps) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <AppText variant="bodyStrong">{title}</AppText>
        <View style={styles.tag}>
          <AppText variant="overline" color={colors.textMuted}>
            {label.toUpperCase()}
          </AppText>
        </View>
      </View>
      <AppText variant="caption" color={colors.textMuted} style={styles.body}>
        {body}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  tag: {},
  body: { marginTop: spacing.sm },
});
