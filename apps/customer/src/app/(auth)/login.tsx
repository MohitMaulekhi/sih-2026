import { useRouter } from "expo-router";
import { LoginForm } from "@repo/auth";

export default function CustomerLoginScreen() {
  const router = useRouter();

  return (
    <LoginForm
      targetRole="customer"
      onNavigateToSignUp={() => router.push("/(auth)/signup")}
    />
  );
}
