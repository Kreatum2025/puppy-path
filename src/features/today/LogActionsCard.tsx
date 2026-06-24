import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, SectionTitle } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import type { WeeklyProgress } from '@/context/PuppyContext';
import { LogSheet, type LogAction } from './LogSheet';
import { colors, radius, spacing } from '@/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ActionDef {
  action: LogAction;
  label: string;
  icon: IoniconName;
  progressKey: keyof WeeklyProgress;
}

const ACTIONS: ActionDef[] = [
  { action: 'weight', label: 'Vikt', icon: 'barbell-outline', progressKey: 'weightLogged' },
  { action: 'height', label: 'Mankhöjd', icon: 'resize-outline', progressKey: 'heightLogged' },
  { action: 'photo', label: 'Bild', icon: 'camera-outline', progressKey: 'photoSaved' },
  { action: 'milestone', label: 'Milstolpe', icon: 'ribbon-outline', progressKey: 'milestoneSelected' },
  { action: 'challenge', label: 'Utmaning', icon: 'paw-outline', progressKey: 'challengeSelected' },
];

interface LogActionsCardProps {
  onLogged: (message: string) => void;
}

/** The "Logga idag" action grid. Each opens a sheet and updates weekly progress. */
export function LogActionsCard({ onLogged }: LogActionsCardProps) {
  const { weeklyProgress } = usePuppy();
  const [active, setActive] = useState<LogAction | null>(null);

  return (
    <View>
      <SectionTitle title="Logga idag" />
      <View style={styles.grid}>
        {ACTIONS.map((a) => {
          const done = weeklyProgress[a.progressKey];
          return (
            <Pressable
              key={a.action}
              onPress={() => setActive(a.action)}
              style={styles.tile}
            >
              <View style={[styles.iconWrap, done && styles.iconWrapDone]}>
                <Ionicons
                  name={a.icon}
                  size={22}
                  color={done ? colors.white : colors.primary}
                />
                {done ? (
                  <View style={styles.doneBadge}>
                    <Ionicons name="checkmark" size={11} color={colors.white} />
                  </View>
                ) : null}
              </View>
              <AppText variant="caption" color={colors.text}>
                {a.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <LogSheet action={active} onClose={() => setActive(null)} onLogged={onLogged} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  tile: { alignItems: 'center', gap: spacing.sm, flex: 1 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  doneBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
});
