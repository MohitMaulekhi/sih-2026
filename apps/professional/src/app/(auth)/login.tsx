import { useRouter } from "expo-router";
import { LoginForm } from "@repo/auth";

export default function ProfessionalLoginScreen() {
  const router = useRouter();

  return (
    <LoginForm
      targetRole="professional"
      onNavigateToSignUp={() => router.push("/(auth)/signup")}
    />
  );
}
