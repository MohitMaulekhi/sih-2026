import { View, Text, Pressable, StyleSheet } from "react-native";
import { useAuth } from "../useAuth";

export const RoleMismatchAlert = () => {
  const { roleMismatchError, clearRoleMismatchError } = useAuth();

  if (!roleMismatchError) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>⚠️</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Access Restricted</Text>
        <Text style={styles.message}>{roleMismatchError}</Text>
      </View>
      <Pressable style={styles.dismissButton} onPress={clearRoleMismatchError}>
        <Text style={styles.dismissText}>Dismiss</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    flexDirection: "column",
    gap: 8,
  },
  iconContainer: {
    alignSelf: "flex-start",
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#B91C1C",
    lineHeight: 20,
  },
  dismissButton: {
    alignSelf: "flex-end",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  dismissText: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "600",
  },
});
