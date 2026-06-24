import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { AppButton, AppText } from '@/components';
import { usePuppy } from '@/context/PuppyContext';
import { getMilestoneSuggestions } from '@/services/milestoneService';
import { getChallengeSuggestions } from '@/services/challengeService';
import { colors, radius, spacing, type as typePresets } from '@/theme';

export type LogAction = 'weight' | 'height' | 'photo' | 'milestone' | 'challenge';

interface LogSheetProps {
  action: LogAction | null;
  onClose: () => void;
  onLogged: (message: string) => void;
}

const CONFIG: Record<LogAction, { title: string; subtitle: string; success: string }> = {
  weight: {
    title: 'Logga vikt',
    subtitle: 'Fyll i din valps vikt just nu.',
    success: 'Vikt sparad',
  },
  height: {
    title: 'Logga mankhöjd',
    subtitle: 'Mät från marken till manken.',
    success: 'Mankhöjd sparad',
  },
  photo: {
    title: 'Veckans bild',
    subtitle: 'Spara ett minne från den här veckan.',
    success: 'Veckans bild sparad',
  },
  milestone: {
    title: 'Ny milstolpe',
    subtitle: 'Vad har din valp klarat den här veckan?',
    success: 'Milstolpe tillagd',
  },
  challenge: {
    title: 'Veckans utmaning',
    subtitle: 'Vad tränar ni på just nu?',
    success: 'Utmaning sparad',
  },
};

function parseNumber(input: string): number | null {
  const n = Number(input.replace(',', '.').trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Bottom sheet for the five "Logga idag"-actions. Mock-local writes only. */
export function LogSheet({ action, onClose, onLogged }: LogSheetProps) {
  const insets = useSafeAreaInsets();

  if (!action) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(280)}
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
        >
          {/* Keyed by action so form state resets cleanly between actions. */}
          <SheetBody key={action} action={action} onClose={onClose} onLogged={onLogged} />
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function SheetBody({
  action,
  onClose,
  onLogged,
}: {
  action: LogAction;
  onClose: () => void;
  onLogged: (message: string) => void;
}) {
  const { logWeight, logHeight, savePhoto, selectMilestone, selectChallenge } = usePuppy();
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (action === 'milestone') getMilestoneSuggestions().then(setSuggestions);
    else if (action === 'challenge') getChallengeSuggestions().then(setSuggestions);
  }, [action]);

  const cfg = CONFIG[action];
  const isNumeric = action === 'weight' || action === 'height';
  const isText = action === 'milestone' || action === 'challenge';

  const canSave =
    action === 'photo' ||
    (isNumeric && parseNumber(text) != null) ||
    (isText && text.trim().length > 0);

  const handleSave = () => {
    switch (action) {
      case 'weight': {
        const v = parseNumber(text);
        if (v != null) logWeight(v);
        break;
      }
      case 'height': {
        const v = parseNumber(text);
        if (v != null) logHeight(v);
        break;
      }
      case 'photo':
        savePhoto(null);
        break;
      case 'milestone':
        selectMilestone(text.trim());
        break;
      case 'challenge':
        selectChallenge(text.trim());
        break;
    }
    onLogged(cfg.success);
    onClose();
  };

  return (
    <>
      <View style={styles.handle} />
      <AppText variant="heading">{cfg.title}</AppText>
      <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
        {cfg.subtitle}
      </AppText>

      {isNumeric ? (
        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={action === 'weight' ? '7,4' : '32'}
            placeholderTextColor={colors.textMuted}
            keyboardType={action === 'weight' ? 'decimal-pad' : 'number-pad'}
            autoFocus
            style={styles.input}
          />
          <AppText variant="heading" color={colors.textMuted}>
            {action === 'weight' ? 'kg' : 'cm'}
          </AppText>
        </View>
      ) : null}

      {isText ? (
        <>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Skriv här…"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
            maxLength={48}
          />
          <View style={styles.chips}>
            {suggestions.map((s) => (
              <Pressable key={s} onPress={() => setText(s)} style={styles.chip}>
                <AppText variant="caption" color={colors.primary}>
                  {s}
                </AppText>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      {action === 'photo' ? (
        <View style={styles.photoBox}>
          <Ionicons name="camera-outline" size={34} color={colors.textMuted} />
          <AppText variant="caption" color={colors.textMuted} align="center">
            Bilduppladdning kopplas in i ett senare steg. Spara en platshållare så
            syns den i veckokortet.
          </AppText>
        </View>
      ) : null}

      <View style={styles.actions}>
        <AppButton label="Spara" onPress={handleSave} disabled={!canSave} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  backdropPress: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xl },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  input: { ...typePresets.stat, color: colors.text, flex: 1 },
  textInput: {
    ...typePresets.body,
    color: colors.text,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  chip: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  photoBox: {
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  actions: { marginTop: spacing.xl },
});
