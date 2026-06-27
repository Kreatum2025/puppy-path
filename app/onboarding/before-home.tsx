import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppCard, AppText, IconCircle } from '@/components';
import { colors, spacing } from '@/theme';

/**
 * onboarding_info-kort: bryggan mellan "tiden hos mamma/kull" och "livet hemma
 * hos dig". Visas efter ålders- och hemkomststeget. Hjälper användaren att inte
 * blanda ihop biologisk vecka 8-12 med "första veckan hemma".
 */
export default function BeforeHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <IconCircle name="heart-outline" size={56} tone="forest" />
          <AppText variant="title" style={styles.title}>
            Innan valpen kom hem till dig
          </AppText>
          <AppCard padding="md">
            <AppText variant="body" style={styles.p}>
              Din valp har redan varit med om sin första viktiga resa. De första
              veckorna har den fått vara nära sin mamma och sina kullsyskon. Där har
              valpen fått näring, värme och trygghet, men också börjat lära sig
              hundspråk, lek, gränser och hur man är tillsammans med andra.
            </AppText>
            <AppText variant="body" style={styles.p}>
              Nu börjar nästa stora steg: livet hemma hos dig.
            </AppText>
            <AppText variant="body">
              Den första tiden handlar inte om att göra allt perfekt. Det
              viktigaste är trygghet, vila, små rutiner och att ni får lära känna
              varandra i lugn takt.
            </AppText>
          </AppCard>
        </Animated.View>
      </ScrollView>

      <AppButton label="Fortsätt" onPress={() => router.push('/onboarding/photo')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  scroll: { paddingBottom: spacing.lg },
  title: { marginTop: spacing.lg, marginBottom: spacing.lg },
  p: { marginBottom: spacing.md },
});
