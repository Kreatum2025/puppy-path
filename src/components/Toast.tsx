import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { AppText } from './AppText';
import { colors, radius, shadow, spacing } from '@/theme';

interface ToastProps {
  /** Message to show; null hides the toast. */
  message: string | null;
  /** Auto-dismiss callback. */
  onHide: () => void;
  duration?: number;
}

/**
 * Subtle success toast for "Vikt sparad", "Milstolpe tillagd" etc. Warm and
 * brief — positive reinforcement, never intrusive.
 */
export function Toast({ message, onHide, duration = 1800 }: ToastProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [message, duration, onHide]);

  if (!message) return null;

  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      <Animated.View entering={FadeInUp.duration(250)} exiting={FadeOut.duration(200)} style={styles.toast}>
        <Ionicons name="checkmark-circle" size={18} color={colors.success} />
        <AppText variant="bodyStrong" color={colors.text}>
          {message}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 50 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    ...shadow.card,
  },
});
