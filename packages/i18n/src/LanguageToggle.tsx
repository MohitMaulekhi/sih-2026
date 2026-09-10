import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, SupportedLanguage } from './core';

interface LanguageToggleProps {
  /** Accent color used for the selected segment (matches each app's theme). */
  accentColor?: string;
  /** Background color of the unselected track. */
  trackColor?: string;
  /** Text color for the unselected segment. */
  inactiveTextColor?: string;
  /** Text color for the selected segment. */
  activeTextColor?: string;
}

/**
 * Simple English / हिंदी segmented control. Reads and writes the shared
 * i18next instance so both the customer and professional apps stay in sync
 * with the same translation keys.
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  accentColor = '#EA580C',
  trackColor = '#F1F5F9',
  inactiveTextColor = '#64748B',
  activeTextColor = '#FFFFFF',
}) => {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  const options: { code: SupportedLanguage; labelKey: 'common.english' | 'common.hindi' }[] = [
    { code: 'en', labelKey: 'common.english' },
    { code: 'hi', labelKey: 'common.hindi' },
  ];

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      {options.map((opt) => {
        const isActive = current === opt.code;
        return (
          <TouchableOpacity
            key={opt.code}
            activeOpacity={0.8}
            style={[
              styles.segment,
              isActive && { backgroundColor: accentColor },
            ]}
            onPress={() => changeLanguage(opt.code)}>
            <Text
              style={[
                styles.segmentText,
                { color: isActive ? activeTextColor : inactiveTextColor },
                isActive && styles.segmentTextActive,
              ]}>
              {opt.code === 'en' ? 'English' : 'हिंदी'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  segmentTextActive: {
    fontWeight: '800',
  },
});
