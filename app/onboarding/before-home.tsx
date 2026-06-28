import { Platform, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppCard, AppText, StoryImageSlot } from '@/components';
import { colors, radius, spacing } from '@/theme';

const webCenter: ViewStyle | null =
  Platform.OS === 'web' ? { width: '100%', maxWidth: 560, alignSelf: 'center' } : null;

/**
 * A story moment that bridges the puppy's first weeks with the litter and the
 * start of life at home. Sets a warm, narrative tone (not just a text card).
 */
export default function BeforeHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        webCenter,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Tillbaka"
        style={styles.back}
      >
        <AppText variant="body" color={colors.textMuted}>
          ‹ Tillbaka
        </AppText>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.inner}>
          {/* Future image: puppy with its mother and littermates */}
          <StoryImageSlot aspectRatio={4 / 3} tone="sand" />

          <View>
            <AppText variant="overline" color={colors.moss} style={styles.overline}>
              INNAN ER RESA BÖRJAR
            </AppText>
            <AppText variant="title">Innan valpen kom hem till dig</AppText>
          </View>

          <AppCard variant="secondary" padding="md">
            <AppText variant="body" style={styles.p}>
              Din valp har redan varit med om sin första viktiga resa. De första
              veckorna har den varit nära sin mamma och sina kullsyskon. Där har
              valpen fått näring, värme och trygghet, men också börjat lära sig
              hundspråk, lek och gränser.
            </AppText>
            <AppText variant="body" style={styles.p}>
              Nu börjar nästa steg: livet hemma hos dig.
            </AppText>
            <AppText variant="body">
              Den första tiden handlar inte om att göra allt perfekt. Det
              viktigaste är trygghet, vila, små rutiner och att ni får lära känna
              varandra i lugn takt.
            </AppText>
          </AppCard>

          <View style={styles.chips}>
            <View style={styles.chip}>
              <AppText variant="caption" color={colors.text}>
                Första veckorna: mamma, kull och trygghet
              </AppText>
            </View>
            <View style={styles.chip}>
              <AppText variant="caption" color={colors.text}>
                Nu: hemmet, vila och relation
              </AppText>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      <AppButton label="Fortsätt" onPress={() => router.push('/onboarding/photo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  back: { paddingTop: spacing.sm, paddingBottom: spacing.md },
  scroll: { paddingBottom: spacing.lg },
  inner: { gap: spacing.lg },
  overline: { marginBottom: spacing.xs },
  p: { marginBottom: spacing.md },
  chips: { gap: spacing.sm },
  chip: {
    backgroundColor: colors.surfaceSage,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});
