import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing } from '@/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional small overline (e.g. "VECKA 12"). */
  overline?: string;
  /** Optional trailing element (e.g. an action). */
  trailing?: React.ReactNode;
}

/** Lightweight screen header (title + optional subtitle). */
export function AppHeader({ title, subtitle, overline, trailing }: AppHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.text}>
        {overline ? (
          <AppText variant="overline" color={colors.moss} style={styles.overline}>
            {overline.toUpperCase()}
          </AppText>
        ) : null}
        <AppText variant="title">{title}</AppText>
        {subtitle ? (
          <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  text: { flexShrink: 1 },
  overline: { marginBottom: spacing.xs },
  subtitle: { marginTop: spacing.xs },
});
