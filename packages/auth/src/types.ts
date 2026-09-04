import type { UserRole, Profile } from "@repo/db";
import type { Session, User } from "@supabase/supabase-js";

export type { UserRole, Profile };

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  roleMismatchError: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  clearRoleMismatchError: () => void;
  refetchProfile: () => Promise<Profile | null>;
}
