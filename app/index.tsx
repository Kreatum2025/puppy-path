import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  AppButton,
  AppCard,
  AppText,
  IconCircle,
  PathMark,
  ScreenContainer,
  StoryImageSlot,
  type IoniconName,
} from '@/components';
import { colors, spacing } from '@/theme';

const STEPS: { icon: IoniconName; title: string; body: string }[] = [
  {
    icon: 'paw-outline',
    title: 'Skapa valpens profil',
    body: 'Namn, ålder, hemkomst och ras. Bara det som behövs för att börja.',
  },
  {
    icon: 'calendar-outline',
    title: 'Följ veckan',
    body: 'Veckans tema, dagens lilla mål och lugna råd i rätt tid.',
  },
  {
    icon: 'bookmark-outline',
    title: 'Bygg första kapitlet',
    body: 'Spara bilder, små steg och minnen från resan tillsammans.',
  },
];

/**
 * Welcome screen. A warm, premium intro that sells the journey (the first year
 * goes fast - here you build the first chapter), not a feature table.
 */
export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer maxContentWidth={560} contentContainerStyle={{ gap: spacing.xl }}>
      {/* Brand row */}
      <Animated.View entering={FadeIn.duration(500)} style={styles.brandRow}>
        <PathMark size={22} />
        <AppText variant="overline" color={colors.moss}>
          PUPPYJOURNEY
        </AppText>
      </Animated.View>

      {/* Hero story card */}
      <Animated.View entering={FadeInDown.delay(80).duration(600)}>
        <AppCard variant="primary" padding="lg">
          <AppText variant="overline" color={colors.moss}>
            VALPENS FÖRSTA ÅR
          </AppText>
          <AppText variant="hero" style={styles.heroTitle}>
            Följ din valps första kapitel
          </AppText>
          <AppText variant="body" color={colors.textMuted} style={styles.heroBody}>
            Små steg, trygg vägledning och minnen från första tiden tillsammans.
          </AppText>
          <StoryImageSlot aspectRatio={16 / 10} tone="sage" style={styles.heroImage} />
        </AppCard>
      </Animated.View>

      {/* Value statement */}
      <Animated.View entering={FadeInDown.delay(180).duration(600)}>
        <AppText variant="body" color={colors.text} style={styles.value}>
          Den första tiden går fort. PuppyJourney hjälper dig följa veckan, förstå
          utvecklingen och spara stunderna du vill minnas.
        </AppText>
      </Animated.View>

      {/* How it works */}
      <View style={styles.steps}>
        <AppText variant="overline" color={colors.moss}>
          SÅ FUNKAR DET
        </AppText>
        {STEPS.map((s, i) => (
          <Animated.View key={s.title} entering={FadeInDown.delay(260 + i * 80).duration(500)}>
            <AppCard variant="primary" padding="md">
              <View style={styles.step}>
                <IconCircle name={s.icon} size={44} tone="forest" />
                <View style={styles.stepText}>
                  <AppText variant="bodyStrong">
                    {i + 1}. {s.title}
                  </AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {s.body}
                  </AppText>
                </View>
              </View>
            </AppCard>
          </Animated.View>
        ))}
      </View>

      {/* CTA */}
      <Animated.View entering={FadeInDown.delay(540).duration(500)} style={styles.cta}>
        <AppButton label="Skapa valpprofil" onPress={() => router.push('/onboarding')} />
        <AppText
          variant="caption"
          color={colors.textMuted}
          align="center"
          style={styles.footnote}
        >
          Du kan börja utan konto.
        </AppText>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  heroTitle: { marginTop: spacing.sm, marginBottom: spacing.sm },
  heroBody: { marginBottom: spacing.lg },
  heroImage: {},
  value: {},
  steps: { gap: spacing.md },
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepText: { flexShrink: 1, gap: 2 },
  cta: {},
  footnote: { marginTop: spacing.md },
});
