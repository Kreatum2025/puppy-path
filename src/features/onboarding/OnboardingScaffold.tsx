import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppButton, AppText } from '@/components';
import { colors, radius, spacing } from '@/theme';

interface OnboardingScaffoldProps {
  /** 0-based index of this step. */
  stepIndex: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext: () => void;
  onBack?: () => void;
  /** Optional secondary action under the primary button. */
  secondary?: { label: string; onPress: () => void };
}

/** Shared layout for every onboarding step — consistent progress + footer. */
export function OnboardingScaffold({
  stepIndex,
  totalSteps,
  title,
  subtitle,
  children,
  nextLabel = 'Fortsätt',
  nextDisabled = false,
  onNext,
  onBack,
  secondary,
}: OnboardingScaffoldProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Tillbaka"
          >
            <AppText variant="body" color={colors.textMuted}>
              ‹ Tillbaka
            </AppText>
          </Pressable>
        ) : (
          <View />
        )}
        <AppText variant="caption" color={colors.textMuted}>
          {stepIndex + 1} / {totalSteps}
        </AppText>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i <= stepIndex ? colors.primary : colors.border,
                width: i === stepIndex ? 22 : 8,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        entering={FadeInDown.duration(450)}
        style={styles.body}
        key={stepIndex}
      >
        <AppText variant="title" style={styles.title}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="body" color={colors.textMuted} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
        <View style={styles.content}>{children}</View>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <AppButton label={nextLabel} onPress={onNext} disabled={nextDisabled} />
        {secondary ? (
          <Pressable onPress={secondary.onPress} style={styles.secondary} hitSlop={8}>
            <AppText variant="bodyStrong" color={colors.textMuted} align="center">
              {secondary.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xxl },
  dot: { height: 8, borderRadius: radius.pill },
  body: { flex: 1 },
  title: { marginBottom: spacing.sm },
  subtitle: { marginBottom: spacing.xl },
  content: { flex: 1 },
  footer: { paddingTop: spacing.md },
  secondary: { marginTop: spacing.md, paddingVertical: spacing.sm },
});
