import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { UserProfile, UserRole } from '@repo/types';
import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface SignUpData {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  city?: string;
  address?: string;
  role: UserRole;
  experienceYears?: number;
  bio?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  isLoading: boolean;
  expectedRole: UserRole;
  roleMismatch: boolean;
  roleMismatchMessage: string | null;
  clearRoleMismatch: () => void;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
  expectedRole: UserRole;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  expectedRole,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roleMismatch, setRoleMismatch] = useState<boolean>(false);
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(
    null
  );

  // Fetch real profile from public.profiles table in Supabase
  const fetchUserProfile = useCallback(
    async (userId: string, authUser?: User): Promise<UserProfile | null> => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error || !data) {
          // If profile table doesn't have the record yet (e.g. trigger delayed), construct from auth metadata
          const meta = authUser?.user_metadata || {};
          const fallbackProfile: UserProfile = {
            id: userId,
            role: (meta.role as UserRole) || expectedRole,
            fullName: meta.full_name || authUser?.email?.split('@')[0] || 'User',
            email: authUser?.email || '',
            phone: meta.phone || null,
            city: meta.city || 'Bengaluru',
            address: meta.address || null,
            bio: meta.bio || null,
            avatarUrl: meta.avatar_url || null,
            rating: meta.rating ? Number(meta.rating) : 5.0,
            experienceYears: meta.experience_years ? Number(meta.experience_years) : 1,
            isVerified: true,
            isOnline: true,
            createdAt: authUser?.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return fallbackProfile;
        }

        return {
          id: data.id,
          role: data.role as UserRole,
          fullName: data.full_name || 'User',
          email: data.email,
          phone: data.phone,
          avatarUrl: data.avatar_url,
          bio: data.bio,
          city: data.city || 'Bengaluru',
          address: data.address,
          rating: data.rating ? Number(data.rating) : 5.0,
          experienceYears: data.experience_years,
          isVerified: data.is_verified,
          isOnline: data.is_online,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      } catch (err) {
        console.error('Error fetching profile from Supabase:', err);
        return null;
      }
    },
    [expectedRole]
  );

  // Handle and enforce strict role isolation
  const handleSessionChange = useCallback(
    async (currentSession: Session | null) => {
      setIsLoading(true);
      if (!currentSession?.user) {
        setUser(null);
        setSupabaseUser(null);
        setSession(null);
        setRoleMismatch(false);
        setRoleMismatchMessage(null);
        setIsLoading(false);
        return;
      }

      setSession(currentSession);
      setSupabaseUser(currentSession.user);

      const profile = await fetchUserProfile(
        currentSession.user.id,
        currentSession.user
      );

      if (profile) {
        if (profile.role !== expectedRole) {
          // Role mismatch detected
          setRoleMismatch(true);
          const targetPortal =
            profile.role === 'professional' ? 'Professional Partner Portal' : 'Customer Portal';
          const currentPortalName =
            expectedRole === 'professional' ? 'Partner' : 'Customer';

          setRoleMismatchMessage(
            `Access Restricted: Your account is registered as a ${profile.role.toUpperCase()}. This application is strictly for ${currentPortalName}s. Please use the ${targetPortal}.`
          );
          setUser(profile);
        } else {
          setRoleMismatch(false);
          setRoleMismatchMessage(null);
          setUser(profile);
        }
      }

      setIsLoading(false);
    },
    [expectedRole, fetchUserProfile]
  );

  // Initialize session and subscribe to Supabase Auth State changes
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          await handleSessionChange(data.session);
        }
      } catch (err) {
        console.error('Supabase getSession error:', err);
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (mounted) {
        await handleSessionChange(newSession);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSessionChange]);

  const clearRoleMismatch = () => {
    setRoleMismatch(false);
    setRoleMismatchMessage(null);
    setUser(null);
    setSupabaseUser(null);
    setSession(null);
    supabase.auth.signOut().catch(() => {});
  };

  const signIn = async (
    email: string,
    password?: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password || '',
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id, data.user);
        if (profile && profile.role !== expectedRole) {
          setRoleMismatch(true);
          setRoleMismatchMessage(
            `Access Restricted: You are signed in as a ${profile.role.toUpperCase()}. This app is for ${expectedRole.toUpperCase()}s only.`
          );
          setUser(profile);
          setIsLoading(false);
          return { error: `Role mismatch: User is a ${profile.role}` };
        }

        setUser(profile);
        setSupabaseUser(data.user);
        setSession(data.session);
        setRoleMismatch(false);
        setRoleMismatchMessage(null);
      }

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Failed to sign in' };
    }
  };

  const signUp = async (data: SignUpData): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password || 'password123',
        options: {
          data: {
            full_name: data.fullName.trim(),
            role: data.role,
            phone: data.phone?.trim(),
            city: data.city || 'Bengaluru',
            address: data.address,
            bio: data.bio,
            experience_years: data.experienceYears,
          },
        },
      });

      if (authError) {
        setIsLoading(false);
        return { error: authError.message };
      }

      if (authData.user) {
        // Ensure profile row exists in public.profiles
        const profileRow = {
          id: authData.user.id,
          role: data.role,
          full_name: data.fullName.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || null,
          city: data.city || 'Bengaluru',
          address: data.address || null,
          bio: data.bio || null,
          experience_years: data.experienceYears || 1,
          is_verified: true,
          is_online: true,
          updated_at: new Date().toISOString(),
        };

        Promise.resolve(
          supabase.from('profiles').upsert(profileRow)
        ).catch(() => {});

        const newProfile: UserProfile = {
          id: authData.user.id,
          role: data.role,
          fullName: data.fullName.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || null,
          city: data.city || 'Bengaluru',
          address: data.address || null,
          bio: data.bio || null,
          experienceYears: data.experienceYears || 1,
          rating: 5.0,
          isVerified: true,
          isOnline: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUser(newProfile);
        setSupabaseUser(authData.user);
        setSession(authData.session);
      }

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Failed to create account' };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
      setRoleMismatch(false);
      setRoleMismatchMessage(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const dbPayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (data.fullName !== undefined) dbPayload.full_name = data.fullName;
      if (data.phone !== undefined) dbPayload.phone = data.phone;
      if (data.city !== undefined) dbPayload.city = data.city;
      if (data.address !== undefined) dbPayload.address = data.address;
      if (data.bio !== undefined) dbPayload.bio = data.bio;
      if (data.avatarUrl !== undefined) dbPayload.avatar_url = data.avatarUrl;
      if (data.isOnline !== undefined) dbPayload.is_online = data.isOnline;

      await supabase.from('profiles').update(dbPayload).eq('id', user.id);

      setUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        isLoading,
        expectedRole,
        roleMismatch,
        roleMismatchMessage,
        clearRoleMismatch,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
