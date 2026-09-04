import { ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import type { UserRole } from "@repo/db";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  targetRole: UserRole;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  targetRole,
}: AuthLayoutProps) => {
  const isCustomer = targetRole === "customer";
  const badgeText = isCustomer ? "CUSTOMER PORTAL" : "PROFESSIONAL PORTAL";
  const badgeColor = isCustomer ? "#2563EB" : "#7C3AED";
  const badgeBg = isCustomer ? "#EFF6FF" : "#F5F3FF";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: badgeBg, borderColor: badgeColor },
                ]}
              >
                <Text style={[styles.badgeText, { color: badgeColor }]}>
                  {badgeText}
                </Text>
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
