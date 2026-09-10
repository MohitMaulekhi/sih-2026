import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Home, Compass, Calendar, User } from 'lucide-react-native';
import { useTranslation } from '@repo/i18n';

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
  const { t } = useTranslation();

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
          title: t('tabs.customer.home'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Home} label={t('tabs.customer.home')} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('tabs.customer.explore'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Compass} label={t('tabs.customer.explore')} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabs.customer.bookings'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Calendar} label={t('tabs.customer.bookings')} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.customer.account'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={User} label={t('tabs.customer.account')} />
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
