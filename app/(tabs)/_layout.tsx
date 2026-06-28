import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, type ColorValue, type ViewStyle } from 'react-native';
import { colors, fonts } from '@/theme';

// Remove the browser focus outline on tabs in the Expo web demo (no native effect).
const webNoOutline =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as ViewStyle) : null;

type IoniconName = keyof typeof Ionicons.glyphMap;

function tabIcon(name: IoniconName) {
  return function TabBarIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons name={name} size={size} color={color} />;
  };
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: [styles.item, webNoOutline],
      }}
    >
      <Tabs.Screen
        name="today"
        options={{ title: 'Idag', tabBarIcon: tabIcon('today-outline') }}
      />
      <Tabs.Screen
        name="puppy"
        options={{ title: 'Min valp', tabBarIcon: tabIcon('paw-outline') }}
      />
      <Tabs.Screen
        name="journey"
        options={{ title: 'Resan', tabBarIcon: tabIcon('trail-sign-outline') }}
      />
      <Tabs.Screen
        name="guide"
        options={{ title: 'Guide', tabBarIcon: tabIcon('book-outline') }}
      />
      <Tabs.Screen
        name="offers"
        options={{ title: 'Erbjudanden', tabBarIcon: tabIcon('gift-outline') }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    height: Platform.select({ ios: 88, default: 64 }),
    paddingTop: 6,
  },
  label: { fontFamily: fonts.bodyMedium, fontSize: 11 },
  item: { paddingTop: 2 },
});
