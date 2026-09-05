import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { UserRole } from '@repo/types';

interface RoleMismatchAlertProps {
  visible: boolean;
  expectedRole: UserRole;
  currentRole: UserRole;
  message?: string | null;
  onSwitchToCorrectAccount: () => void;
  onSignOut: () => void;
}

export const RoleMismatchAlert: React.FC<RoleMismatchAlertProps> = ({
  visible,
  expectedRole,
  currentRole,
  message,
  onSwitchToCorrectAccount,
  onSignOut,
}) => {
  if (!visible) return null;

  const isProTarget = expectedRole === 'professional';

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onSignOut}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🛡️</Text>
          </View>

          <Text style={styles.title}>Role Isolation Guard</Text>

          <Text style={styles.description}>
            {message ||
              `You are currently logged in as a ${currentRole.toUpperCase()}, but this application portal is strictly for ${expectedRole.toUpperCase()}s.`}
          </Text>

          <View style={styles.roleBadgeContainer}>
            <View style={styles.roleTagCurrent}>
              <Text style={styles.roleTagTextCurrent}>
                Current: {currentRole}
              </Text>
            </View>
            <Text style={styles.arrowText}>➔</Text>
            <View
              style={
                isProTarget ? styles.roleTagTargetPro : styles.roleTagTargetCust
              }>
              <Text
                style={
                  isProTarget
                    ? styles.roleTagTextTargetPro
                    : styles.roleTagTextTargetCust
                }>
                Required: {expectedRole}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isProTarget
                ? styles.primaryButtonPro
                : styles.primaryButtonCust,
            ]}
            activeOpacity={0.8}
            onPress={onSwitchToCorrectAccount}>
            <Text style={styles.primaryButtonText}>
              Switch to {isProTarget ? 'Professional Partner' : 'Customer'} Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={onSignOut}>
            <Text style={styles.secondaryButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#475569',
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  roleTagCurrent: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  roleTagTextCurrent: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  arrowText: {
    color: '#64748B',
    fontSize: 14,
  },
  roleTagTargetCust: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
  },
  roleTagTextTargetCust: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  roleTagTargetPro: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  roleTagTextTargetPro: {
    color: '#6EE7B7',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonCust: {
    backgroundColor: '#7C3AED',
  },
  primaryButtonPro: {
    backgroundColor: '#10B981',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});
