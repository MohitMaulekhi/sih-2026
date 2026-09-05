import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Home, Compass, Calendar, User } from 'lucide-react-native';

interface TabIconProps {
  focused: boolean;
  IconComponent: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, IconComponent, label }) => {
  const activeColor = '#EA580C';
  const inactiveColor = '#64748B';

  return (
    <View style={styles.tabItem}>
      <IconComponent
        size={22}
        color={focused ? activeColor : inactiveColor}
        strokeWidth={focused ? 2.5 : 2}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? activeColor : inactiveColor },
          focused && styles.tabLabelFocused,
        ]}>
        {label}
      </Text>
    </View>
  );
};

export default function CustomerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          ...Platform.select({
            web: {
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
            },
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Home} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Compass} label="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Calendar} label="Bookings" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={User} label="Account" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabLabelFocused: {
    fontWeight: '800',
  },
});
