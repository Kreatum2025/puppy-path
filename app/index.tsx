import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AppButton, AppText, IconCircle, PathMark, type IoniconName } from '@/components';
import { colors, radius, spacing } from '@/theme';

const STEPS: { icon: IoniconName; title: string; body: string }[] = [
  {
    icon: 'paw-outline',
    title: 'Skapa profil',
    body: 'Namn, ras, ålder och en första bild. Klart på en minut.',
  },
  {
    icon: 'calendar-outline',
    title: 'Följ veckan',
    body: 'Se nuvarande vecka och logga vikt, bilder, milstolpar och utmaningar.',
  },
  {
    icon: 'share-outline',
    title: 'Skapa veckokort',
    body: 'Samla veckan i ett fint kort att spara och dela.',
  },
];

/**
 * Welcome screen. Introduces PuppyJourney emotionally, then shows a compact
 * "så funkar det" so a new visitor understands the product before the CTA.
 */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {/* Forest hero */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.xxl }]}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.brandRow}>
          <PathMark size={36} />
          <AppText variant="overline" color={colors.sage} style={styles.brand}>
            PUPPYJOURNEY
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(700)} style={styles.heroArt}>
          <View style={styles.heroCircle}>
            <PathMark size={110} color={colors.card} accent={colors.accent} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(700)} style={styles.heroText}>
          <AppText variant="hero" color={colors.white} style={styles.title}>
            Följ din valps första år
          </AppText>
          <AppText variant="body" color={colors.sage}>
            Vecka för vecka, minne för minne.
          </AppText>
        </Animated.View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.delay(280).duration(600)}>
          <AppText variant="body" color={colors.text} style={styles.lead}>
            Spara bilder, vikt, milstolpar och utmaningar, och skapa fina kort att
            dela. Allt samlat till en lugn resa, inte utspritt i kamerarullen och
            anteckningar.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(360).duration(600)} style={styles.steps}>
          <AppText variant="overline" color={colors.accent} style={styles.stepsLabel}>
            SÅ FUNKAR DET
          </AppText>
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
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
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(440).duration(600)} style={styles.cta}>
          <AppButton label="Skapa valpprofil" onPress={() => router.push('/onboarding')} />
          <AppText variant="caption" color={colors.textMuted} align="center" style={styles.footnote}>
            En lugn och personlig valpresa för dig och din valp.
          </AppText>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.primaryDeep,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
  },
  brand: { marginTop: 2 },
  heroArt: { marginTop: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  heroCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#1B4E36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: { marginTop: spacing.xl, alignItems: 'center', gap: spacing.xs },
  title: { textAlign: 'center' },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  lead: {},
  steps: { marginTop: spacing.xl, gap: spacing.lg },
  stepsLabel: {},
  step: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepText: { flexShrink: 1, gap: 2 },
  cta: { marginTop: spacing.xxl },
  footnote: { marginTop: spacing.md },
});
