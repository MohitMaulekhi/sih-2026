import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { LayoutDashboard, ClipboardList, Wrench, User } from 'lucide-react-native';
import { useTranslation } from '@repo/i18n';

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
  const { t } = useTranslation();

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
          title: t('tabs.professional.dashboard'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={LayoutDashboard} label={t('tabs.professional.dashboard')} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabs.professional.jobs'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={ClipboardList} label={t('tabs.professional.jobs')} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: t('tabs.professional.services'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={Wrench} label={t('tabs.professional.services')} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.professional.profile'),
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} IconComponent={User} label={t('tabs.professional.profile')} />
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
