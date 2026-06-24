import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, type as typePresets, type TypePresetName } from '@/theme';

interface AppTextProps extends TextProps {
  /** Typography preset from the design system. */
  variant?: TypePresetName;
  /** Color token from the palette (defaults to text). */
  color?: string;
  /** Convenience text-align. */
  align?: TextStyle['textAlign'];
}

/**
 * The single text primitive. Always renders through design-system presets so
 * no component hardcodes font/size/color. Falls back gracefully to the
 * platform font if the custom font has not loaded.
 */
export function AppText({
  variant = 'body',
  color = colors.text,
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[typePresets[variant], { color }, align ? { textAlign: align } : null, style]}
      {...rest}
    />
  );
}
