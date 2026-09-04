import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { UserRole, Profile, AuthContextType } from "./types";
import { getSupabaseClient } from "./client";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
  expectedRole: UserRole;
}

export const AuthProvider = ({ children, expectedRole }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleMismatchError, setRoleMismatchError] = useState<string | null>(
    null,
  );

  const supabase = getSupabaseClient();

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error || !data) {
          console.error("Error fetching profile:", error);
          return null;
        }

        return {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          role: data.role as UserRole,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
        return null;
      }
    },
    [supabase],
  );

  const handleSessionChange = useCallback(
    async (currentSession: Session | null) => {
      setLoading(true);
      if (!currentSession) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const currentUser = currentSession.user;
      const userProfile = await fetchProfile(currentUser.id);

      if (userProfile) {
        if (userProfile.role !== expectedRole) {
          // Role Mismatch Enforcement
          const actualRole = userProfile.role;
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setProfile(null);
          setRoleMismatchError(
            `This account is registered as a ${actualRole.toUpperCase()}. Please log in using the ${actualRole.toUpperCase()} app.`,
          );
          setLoading(false);
          return;
        }

        setProfile(userProfile);
        setUser(currentUser);
        setSession(currentSession);
        setRoleMismatchError(null);
      } else {
        // Fallback: If trigger hasn't fired yet, check user metadata
        const metaRole =
          (currentUser.user_metadata?.role as UserRole) || "customer";
        if (metaRole !== expectedRole) {
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setProfile(null);
          setRoleMismatchError(
            `This account is registered as a ${metaRole.toUpperCase()}. Please log in using the ${metaRole.toUpperCase()} app.`,
          );
          setLoading(false);
          return;
        }

        setUser(currentUser);
        setSession(currentSession);
        setRoleMismatchError(null);
      }

      setLoading(false);
    },
    [expectedRole, fetchProfile, supabase],
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      handleSessionChange(initialSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      handleSessionChange(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSessionChange, supabase]);

  const signIn = async (email: string, pass: string) => {
    setRoleMismatchError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    setLoading(false);
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const signUp = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
  ) => {
    setRoleMismatchError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    setLoading(false);
    if (error) {
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoleMismatchError(null);
    setLoading(false);
  };

  const clearRoleMismatchError = () => setRoleMismatchError(null);

  const refetchProfile = async (): Promise<Profile | null> => {
    if (!user) return null;
    const p = await fetchProfile(user.id);
    if (p) setProfile(p);
    return p;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        roleMismatchError,
        signIn,
        signUp,
        signOut,
        clearRoleMismatchError,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
