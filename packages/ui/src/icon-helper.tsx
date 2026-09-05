import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type IconName =
  | 'wind'
  | 'sparkles'
  | 'zap'
  | 'droplet'
  | 'scissors'
  | 'smile'
  | 'tool'
  | 'brush'
  | 'clock'
  | 'star'
  | 'shield'
  | 'map-pin'
  | 'check'
  | 'check-circle'
  | 'x-circle'
  | 'calendar'
  | 'phone'
  | 'alert-circle'
  | 'user'
  | 'briefcase'
  | 'dollar'
  | 'settings'
  | 'search'
  | 'filter'
  | 'chevron-right'
  | 'chevron-left'
  | 'arrow-right'
  | 'refresh';

const ICON_MAP: Record<IconName, string> = {
  wind: '❄️',
  sparkles: '✨',
  zap: '⚡',
  droplet: '💧',
  scissors: '✂️',
  smile: '💆‍♀️',
  tool: '🔧',
  brush: '🎨',
  clock: '⏱️',
  star: '★',
  shield: '🛡️',
  'map-pin': '📍',
  check: '✓',
  'check-circle': '✅',
  'x-circle': '❌',
  calendar: '📅',
  phone: '📞',
  'alert-circle': '⚠️',
  user: '👤',
  briefcase: '💼',
  dollar: '💰',
  settings: '⚙️',
  search: '🔍',
  filter: '⚡',
  'chevron-right': '›',
  'chevron-left': '‹',
  'arrow-right': '➔',
  refresh: '🔄',
};

interface IconProps {
  name: IconName | string;
  size?: number;
  color?: string;
}

export const IconHelper: React.FC<IconProps> = ({
  name,
  size = 18,
  color,
}) => {
  const iconEmoji = (ICON_MAP as Record<string, string>)[name] || '⚡';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text
        style={[
          styles.iconText,
          { fontSize: size * 0.85, lineHeight: size },
          color ? { color } : null,
        ]}>
        {iconEmoji}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    textAlign: 'center',
  },
});
