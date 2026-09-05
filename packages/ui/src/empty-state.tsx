import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Inbox, PackageOpen, ClipboardList, Search, LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon?: 'inbox' | 'package' | 'clipboard' | 'search' | string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionText,
  onAction,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'search':
        return <Search size={28} color="#EA580C" />;
      case 'clipboard':
        return <ClipboardList size={28} color="#EA580C" />;
      case 'package':
        return <PackageOpen size={28} color="#EA580C" />;
      default:
        return <Inbox size={28} color="#EA580C" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>{renderIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionText && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={onAction}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: '#EA580C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
