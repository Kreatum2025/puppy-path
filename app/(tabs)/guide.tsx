import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader, AppText, IconCircle, ScreenContainer, Toast } from '@/components';
import { getGuideCategories } from '@/services/guideService';
import type { GuideCategory } from '@/types';
import { colors, radius, spacing } from '@/theme';

export default function GuideScreen() {
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getGuideCategories().then(setCategories);
  }, []);

  const openCategory = useCallback((title: string) => {
    setToast(`"${title}" kommer snart`);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer>
        <AppHeader
          overline="Lugn vägledning"
          title="Guide"
          subtitle="Korta, lugna texter för vardagen med valp. Innehållet fylls på efter hand."
        />

        <View style={styles.grid}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => openCategory(c.title)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <View style={styles.cardTop}>
                <IconCircle name={c.icon} size={44} />
                <View style={styles.soon}>
                  <AppText variant="overline" color={colors.textMuted}>
                    SNART
                  </AppText>
                </View>
              </View>
              <AppText variant="bodyStrong" style={styles.title}>
                {c.title}
              </AppText>
              <View style={styles.bottomRow}>
                <AppText variant="caption" color={colors.textMuted} style={styles.desc}>
                  {c.description}
                </AppText>
                <Ionicons name="chevron-forward" size={16} color={colors.sage} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScreenContainer>

      <Toast message={toast} onHide={() => setToast(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47.5%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardPressed: { backgroundColor: '#F3EFE4' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  soon: {
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  title: { marginTop: spacing.xs },
  bottomRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.sm },
  desc: { flexShrink: 1 },
});
