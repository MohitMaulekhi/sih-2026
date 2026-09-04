import { useRouter } from "expo-router";
import { SignUpForm } from "@repo/auth";

export default function CustomerSignUpScreen() {
  const router = useRouter();

  return (
    <SignUpForm
      targetRole="customer"
      onNavigateToSignIn={() => router.push("/(auth)/login")}
    />
  );
}
