import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

interface ScreenContainerProps {
  children: ReactNode;
  /** Scroll the content (default) or render a static padded view. */
  scroll?: boolean;
  /** Apply top safe-area padding (default true). */
  withTopInset?: boolean;
  /** Extra style on the content container. */
  contentStyle?: ViewStyle;
  /** Background color token (defaults to cream background). */
  background?: string;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

/**
 * Standard cream screen surface with consistent horizontal padding and
 * safe-area handling. Used by every screen so spacing stays calm and uniform.
 */
export function ScreenContainer({
  children,
  scroll = true,
  withTopInset = true,
  contentStyle,
  background = colors.background,
  contentContainerStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const padTop = withTopInset ? insets.top + spacing.sm : spacing.lg;

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: background }]}
        contentContainerStyle={[
          styles.content,
          { paddingTop: padTop, paddingBottom: insets.bottom + spacing.xxxl },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        styles.content,
        { backgroundColor: background, paddingTop: padTop },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
  },
});
