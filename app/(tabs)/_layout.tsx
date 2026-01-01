import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, IconName } from '../../components/Icon';
import { colors, spacing, borderRadius } from '../../lib/theme';

interface TabIconProps {
  icon: IconName;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabIconContainer}>
      <Icon
        name={icon}
        size={20}
        color={focused ? colors.accent.primary : colors.text.tertiary}
        strokeWidth={focused ? 2 : 1.5}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="flame" label="Today" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="bar-chart" label="Progress" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bio-age"
        options={{
          href: null, // Hide from tab bar, accessible via Progress
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          href: null, // Hide from tab bar, accessible via Progress
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="user" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.primary,
    borderTopColor: colors.border.subtle,
    borderTopWidth: 1,
    height: 80,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xs,
  },
  tabIconWrapper: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 9,
    color: colors.text.tertiary,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  tabLabelFocused: {
    color: colors.accent.primary,
  },
});
