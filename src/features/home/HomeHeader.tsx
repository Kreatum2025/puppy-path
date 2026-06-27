import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppText, IconCircle } from '@/components';
import { colors, spacing } from '@/theme';

interface HomeHeaderProps {
  name: string;
  puppyAgeWeeks: number;
  homeWeekLabel: string;
}

/**
 * Calm home header: homecoming phase + name + biological age. Replaces the
 * biological 8-52 progress bar on the home screen (that lives on "Min valp").
 */
export function HomeHeader({ name, puppyAgeWeeks, homeWeekLabel }: HomeHeaderProps) {
  return (
    <Animated.View entering={FadeInDown.duration(500)} style={styles.root}>
      <IconCircle name="paw-outline" size={56} tone="forest" />
      <View style={styles.text}>
        <AppText variant="caption" color={colors.primary}>
          {homeWeekLabel}
        </AppText>
        <AppText variant="title">{name}</AppText>
        <AppText variant="body" color={colors.textMuted}>
          {`${name} är ${puppyAgeWeeks} veckor`}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  text: { flex: 1, gap: 4 },
});
