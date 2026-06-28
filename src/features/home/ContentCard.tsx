import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppCard, AppText } from '@/components';
import { colors, spacing } from '@/theme';

type Tone = 'plain' | 'sage' | 'feature';

interface ContentCardProps {
  title: string;
  body: string;
  /** Small uppercase label above the title, e.g. "DEN HÄR VECKAN". */
  overline?: string;
  /** Optional CTA label. */
  cta?: string;
  onPressCta?: () => void;
  /**
   * Visual hierarchy:
   * - feature: the week's main card (near-white, elevated, green overline)
   * - sage: soft secondary card (reassurance, breed note)
   * - plain: low-emphasis card
   */
  tone?: Tone;
  /** Stagger animation delay (ms). */
  delay?: number;
}

/**
 * Home content card. Tone + overline give the home screen a clear, premium
 * hierarchy (feature / secondary / plain) instead of a flat list of identical
 * cards. The feature card stays light (cream) with a green accent rather than a
 * heavy dark surface.
 */
export function ContentCard({
  title,
  body,
  overline,
  cta,
  onPressCta,
  tone = 'plain',
  delay = 0,
}: ContentCardProps) {
  const feature = tone === 'feature';
  const variant = feature ? 'primary' : tone === 'sage' ? 'secondary' : 'info';
  const overlineColor = feature ? colors.primary : colors.moss;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(450)}>
      <AppCard variant={variant} padding={feature ? 'lg' : 'md'}>
        {overline ? (
          <AppText variant="overline" color={overlineColor} style={styles.overline}>
            {overline}
          </AppText>
        ) : null}
        <AppText
          variant={feature ? 'heading' : 'bodyStrong'}
          color={colors.text}
          style={styles.title}
        >
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
  overline: { marginBottom: spacing.xs },
  title: { marginBottom: spacing.sm },
  cta: { marginTop: spacing.lg },
});
