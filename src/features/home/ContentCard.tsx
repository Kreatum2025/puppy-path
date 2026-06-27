import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppCard, AppText } from '@/components';
import { colors, spacing } from '@/theme';

interface ContentCardProps {
  title: string;
  body: string;
  /** Optional CTA label. Interaction/completion is wired in a later slice (D3). */
  cta?: string;
  onPressCta?: () => void;
  /** Larger, primary card (the week's main card). */
  emphasis?: boolean;
  /** Stagger animation delay (ms). */
  delay?: number;
}

/**
 * Generic home content card (weekly_development / daily_goal / reassurance /
 * breed_note). One card at a time keeps the home screen calm and focused.
 */
export function ContentCard({
  title,
  body,
  cta,
  onPressCta,
  emphasis = false,
  delay = 0,
}: ContentCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)}>
      <AppCard padding={emphasis ? 'lg' : 'md'}>
        <AppText variant={emphasis ? 'heading' : 'bodyStrong'} style={styles.title}>
          {title}
        </AppText>
        <AppText variant="body" color={colors.textMuted}>
          {body}
        </AppText>
        {cta ? (
          <View style={styles.cta}>
            <AppButton
              label={cta}
              variant="secondary"
              size="md"
              fullWidth={false}
              onPress={onPressCta}
            />
          </View>
        ) : null}
      </AppCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.sm },
  cta: { marginTop: spacing.lg },
});
