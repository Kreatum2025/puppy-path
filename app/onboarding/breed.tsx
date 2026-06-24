import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingScaffold } from '@/features/onboarding/OnboardingScaffold';
import { AppText } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { breeds } from '@/data/breeds';
import type { BreedId } from '@/types';
import { colors, radius, spacing, type as typePresets } from '@/theme';

const TOTAL_STEPS = 5;

export default function BreedStep() {
  const router = useRouter();
  const { draft, updateDraft } = usePuppy();
  const [selected, setSelected] = useState<BreedId | null>(draft.breedId);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return breeds;
    // Always keep "Blandras" reachable as a catch-all.
    return breeds.filter(
      (b) => b.name.toLowerCase().includes(q) || b.id === 'mixed',
    );
  }, [query]);

  return (
    <OnboardingScaffold
      stepIndex={1}
      totalSteps={TOTAL_STEPS}
      title="Vilken ras?"
      subtitle="Sök eller välj i listan. Hittar du inte rasen, välj Blandras."
      nextDisabled={!selected}
      onBack={() => router.back()}
      onNext={() => {
        if (selected) updateDraft({ breedId: selected });
        router.push('/onboarding/birthdate');
      }}
    >
      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Sök ras"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 ? (
          <AppText variant="body" color={colors.textMuted}>
            Ingen träff. Välj Blandras om rasen saknas.
          </AppText>
        ) : null}
        {filtered.map((b) => {
          const active = selected === b.id;
          return (
            <Pressable
              key={b.id}
              onPress={() => setSelected(b.id)}
              style={[styles.row, active && styles.rowActive]}
            >
              <AppText variant="bodyStrong" color={active ? colors.primary : colors.text}>
                {b.name}
              </AppText>
              <View style={[styles.check, active && styles.checkActive]}>
                {active ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </OnboardingScaffold>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    marginBottom: spacing.md,
  },
  searchInput: { ...typePresets.body, color: colors.text, flex: 1, paddingVertical: 0 },
  list: { gap: spacing.sm, paddingBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowActive: { borderColor: colors.primary, backgroundColor: '#F3F7F0' },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: { backgroundColor: colors.primary, borderColor: colors.primary },
});
