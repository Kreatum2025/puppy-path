import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing } from '@/theme';

interface SectionTitleProps {
  title: string;
  /** Optional trailing element (e.g. a "Se alla"-link). */
  trailing?: React.ReactNode;
  /** Optional small overline above the title. */
  overline?: string;
}

/** Consistent section heading used across screens. */
export function SectionTitle({ title, trailing, overline }: SectionTitleProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        {overline ? (
          <AppText variant="overline" color={colors.sage} style={styles.overline}>
            {overline.toUpperCase()}
          </AppText>
        ) : null}
        <AppText variant="heading" color={colors.primaryDeep}>
          {title}
        </AppText>
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  left: { flexShrink: 1 },
  overline: { marginBottom: spacing.xs },
});
