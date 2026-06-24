import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppButton, AppText, ScreenContainer, Toast } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { PuppyShareCard } from '@/features/share-card/PuppyShareCard';
import { shareCardThemes } from '@/data/shareCardThemes';
import type { ShareCardThemeId } from '@/types';
import { colors, radius, spacing } from '@/theme';

/** Soft, AI-style caption placeholder (no real AI). */
const CAPTION = 'En vecka full av nyfikenhet, bus och små framsteg.';

export default function ShareCardModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { puppy, latestGrowth, selectedMilestone, selectedChallenge, milestones, challenges } =
    usePuppy();

  const [themeId, setThemeId] = useState<ShareCardThemeId>('forest');
  const [toast, setToast] = useState<string | null>(null);

  const theme = shareCardThemes.find((t) => t.id === themeId) ?? shareCardThemes[0];
  // Reflect the owner's own logged data: this week's selection, else their most
  // recent logged item, else null (the card shows a gentle placeholder).
  const milestone = selectedMilestone ?? milestones[0]?.title ?? null;
  const challenge = selectedChallenge ?? challenges[0]?.title ?? null;

  if (!puppy) return null;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <AppText variant="heading">Veckans kort</AppText>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Stäng">
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
      </View>

      <ScreenContainer withTopInset={false} contentContainerStyle={{ gap: spacing.lg }}>
        {/* Theme selector */}
        <View style={styles.themes}>
          {shareCardThemes.map((t) => {
            const active = t.id === themeId;
            return (
              <Pressable
                key={t.id}
                onPress={() => setThemeId(t.id)}
                style={[styles.themeChip, active && styles.themeChipActive]}
              >
                <View style={[styles.swatch, { backgroundColor: t.background, borderColor: t.border }]} />
                <AppText variant="caption" color={active ? colors.primary : colors.textMuted}>
                  {t.name}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Live preview */}
        <Animated.View key={themeId} entering={FadeIn.duration(300)}>
          <PuppyShareCard
            puppy={puppy}
            growth={latestGrowth}
            milestone={milestone}
            challenge={challenge}
            caption={CAPTION}
            theme={theme}
          />
        </Animated.View>

        <AppText variant="caption" color={colors.textMuted} align="center">
          Förhandsvisning. Milstolpe och utmaning hämtas från det du loggat på
          Idag-fliken.
        </AppText>

        {/* Share — export is a later step */}
        <AppButton
          label="Dela kortet"
          leading={<Ionicons name="share-outline" size={18} color={colors.white} />}
          onPress={() => setToast('Bilddelning kopplas in i ett senare steg')}
        />
      </ScreenContainer>

      <Toast message={toast} onHide={() => setToast(null)} duration={2200} />
    </View>
  );
}

// TODO (later): implement image export with react-native-view-shot and
// expo-sharing so this card can be saved/shared as an image.

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  themes: { flexDirection: 'row', gap: spacing.sm },
  themeChip: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  themeChipActive: { borderColor: colors.primary, backgroundColor: '#F3F7F0' },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
