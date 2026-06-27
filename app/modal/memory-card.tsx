import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AppText, ScreenContainer } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { MemoryShareCard } from '@/features/share-card/MemoryShareCard';
import { shareCardThemes } from '@/data/shareCardThemes';
import type { ShareCardThemeId } from '@/types';
import { colors, radius, spacing } from '@/theme';

/**
 * Memory card preview (D5a). Opens a saved Memory as a visual card with theme
 * options. Preview only - no image export, no OS share, no "shared" toast.
 */
export default function MemoryCardModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { memoryId } = useLocalSearchParams<{ memoryId: string }>();
  const { puppy, memories } = usePuppy();

  const [themeId, setThemeId] = useState<ShareCardThemeId>('forest');
  const theme = shareCardThemes.find((t) => t.id === themeId) ?? shareCardThemes[0];
  const memory = memories.find((m) => m.id === memoryId) ?? null;

  if (!puppy || !memory) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <AppText variant="heading">Minneskort</AppText>
          <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Stäng">
            <Ionicons name="close" size={26} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.fallback}>
          <AppText variant="body" color={colors.textMuted} align="center">
            Minnet kunde inte hittas. Gå tillbaka till valpens resa och försök igen.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <AppText variant="heading">Minneskort</AppText>
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
                <View
                  style={[styles.swatch, { backgroundColor: t.background, borderColor: t.border }]}
                />
                <AppText variant="caption" color={active ? colors.primary : colors.textMuted}>
                  {t.name}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* Preview */}
        <Animated.View key={themeId} entering={FadeIn.duration(300)}>
          <MemoryShareCard puppy={puppy} memory={memory} theme={theme} />
        </Animated.View>

        <AppText variant="caption" color={colors.textMuted} align="center">
          Förhandsvisning av minneskortet.
        </AppText>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
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
