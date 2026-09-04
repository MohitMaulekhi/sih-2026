import { StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@repo/auth";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

export default function HomeScreen() {
  const { profile, user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Customer App
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.userCard}>
          <ThemedText type="subtitle">
            Welcome, {profile?.fullName || user?.email}
          </ThemedText>
          <View style={styles.badgeRow}>
            <View style={styles.roleBadge}>
              <ThemedText style={styles.roleBadgeText}>
                ROLE: {(profile?.role || "CUSTOMER").toUpperCase()}
              </ThemedText>
            </View>
          </View>
          <HintRow
            title="Email"
            hint={<ThemedText type="code">{user?.email}</ThemedText>}
          />
          <Pressable style={styles.signOutButton} onPress={() => signOut()}>
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  userCard: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleBadge: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  signOutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
