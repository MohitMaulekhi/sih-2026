import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { LayoutDashboard, ClipboardList, Wrench, User } from 'lucide-react-native';

interface TabIconProps {
  focused: boolean;
  IconComponent: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, IconComponent, label }) => {
  const activeColor = '#10B981';
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

export default function ProfessionalTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          ...Platform.select({
            web: {
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.4)',
            },
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={LayoutDashboard} label="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={ClipboardList} label="Jobs" />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'My Services',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Wrench} label="My Services" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={User} label="Profile" />
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
    width: 72,
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
