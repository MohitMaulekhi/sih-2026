import { useRouter } from "expo-router";
import { SignUpForm } from "@repo/auth";

export default function ProfessionalSignUpScreen() {
  const router = useRouter();

  return (
    <SignUpForm
      targetRole="professional"
      onNavigateToSignIn={() => router.push("/(auth)/login")}
    />
  );
}
