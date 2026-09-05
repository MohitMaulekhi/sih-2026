import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { UserProfile, UserRole } from '@repo/types';
import { dbStore, DEMO_PROFILES } from '@repo/db';
import { supabase } from './supabase';

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
  isLoading: boolean;
  expectedRole: UserRole;
  roleMismatch: boolean;
  roleMismatchMessage: string | null;
  clearRoleMismatch: () => void;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (data: SignUpData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginAsDemo: (role?: UserRole) => void;
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
  // Default to demo profile matching the expected app role for immediate fluid usage
  const initialProfile =
    DEMO_PROFILES.find((p) => p.role === expectedRole) ??
    DEMO_PROFILES[0] ??
    null;

  const [user, setUser] = useState<UserProfile | null>(initialProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roleMismatch, setRoleMismatch] = useState<boolean>(false);
  const [roleMismatchMessage, setRoleMismatchMessage] = useState<string | null>(
    null
  );

  // Validate user role whenever user or expectedRole changes
  const checkRoleGuard = useCallback(
    (profile: UserProfile | null): boolean => {
      if (!profile) {
        setRoleMismatch(false);
        setRoleMismatchMessage(null);
        return true;
      }

      if (profile.role !== expectedRole) {
        setRoleMismatch(true);
        const correctPortal =
          profile.role === 'professional' ? 'Partner / Pro Portal' : 'Customer Portal';
        const currentPortal =
          expectedRole === 'professional' ? 'Professional Partner' : 'Customer';

        setRoleMismatchMessage(
          `Access Denied: You are logged in as a ${profile.role.toUpperCase()}. This app is for ${currentPortal}s only. Please use the ${correctPortal}.`
        );
        return false;
      }

      setRoleMismatch(false);
      setRoleMismatchMessage(null);
      return true;
    },
    [expectedRole]
  );

  useEffect(() => {
    checkRoleGuard(user);
  }, [user, checkRoleGuard]);

  const clearRoleMismatch = () => {
    setRoleMismatch(false);
    setRoleMismatchMessage(null);
    setUser(null);
  };

  const signIn = async (
    email: string,
    password?: string
  ): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      // 1. First check in-memory store demo profiles
      const profile = dbStore
        .getServices() // touch db
        ? DEMO_PROFILES.find(
            (p) => p.email.toLowerCase() === email.toLowerCase()
          )
        : null;

      if (profile) {
        const isAllowed = checkRoleGuard(profile);
        setUser(profile);
        setIsLoading(false);
        if (!isAllowed) {
          return { error: 'Role mismatch detected.' };
        }
        return {};
      }

      // 2. Try Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password123',
        });

        if (error) {
          // If supabase fails or not configured, create temporary session profile
          const tempProfile: UserProfile = {
            id: `usr-${Date.now()}`,
            role: expectedRole,
            fullName: email.split('@')[0] || 'User',
            email,
            city: 'Bengaluru',
            rating: 5.0,
            isVerified: true,
            isOnline: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          dbStore.saveProfile(tempProfile);
          setUser(tempProfile);
          checkRoleGuard(tempProfile);
          setIsLoading(false);
          return {};
        }

        if (data.user) {
          const profileFromDb = dbStore.getProfileById(data.user.id);
          const loadedProfile: UserProfile = profileFromDb || {
            id: data.user.id,
            role: (data.user.user_metadata?.role as UserRole) || expectedRole,
            fullName: data.user.user_metadata?.full_name || 'User',
            email: data.user.email || email,
            phone: data.user.user_metadata?.phone,
            city: data.user.user_metadata?.city || 'Bengaluru',
            avatarUrl: data.user.user_metadata?.avatar_url,
            createdAt: data.user.created_at,
            updatedAt: new Date().toISOString(),
          };

          dbStore.saveProfile(loadedProfile);
          setUser(loadedProfile);
          const isAllowed = checkRoleGuard(loadedProfile);
          setIsLoading(false);
          if (!isAllowed) {
            return { error: 'Role mismatch detected.' };
          }
          return {};
        }
      } catch {
        // Fallback for offline demo
        const fallbackProfile: UserProfile = {
          id: `usr-${Date.now()}`,
          role: expectedRole,
          fullName: email.split('@')[0] || 'User',
          email,
          city: 'Bengaluru',
          rating: 5.0,
          isVerified: true,
          isOnline: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dbStore.saveProfile(fallbackProfile);
        setUser(fallbackProfile);
        checkRoleGuard(fallbackProfile);
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
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        role: data.role,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city || 'Bengaluru',
        address: data.address,
        bio: data.bio,
        experienceYears: data.experienceYears,
        rating: 5.0,
        isVerified: true,
        isOnline: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dbStore.saveProfile(newProfile);
      setUser(newProfile);
      checkRoleGuard(newProfile);

      // Attempt Supabase signup in background
      supabase.auth
        .signUp({
          email: data.email,
          password: data.password || 'password123',
          options: {
            data: {
              full_name: data.fullName,
              role: data.role,
              phone: data.phone,
              city: data.city,
            },
          },
        })
        .catch(() => {});

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
      await supabase.auth.signOut().catch(() => {});
    } finally {
      setUser(null);
      setRoleMismatch(false);
      setRoleMismatchMessage(null);
      setIsLoading(false);
    }
  };

  const loginAsDemo = (roleOverride?: UserRole) => {
    const targetRole = roleOverride || expectedRole;
    const demo =
      DEMO_PROFILES.find((p) => p.role === targetRole) ??
      DEMO_PROFILES[0] ??
      null;
    setUser(demo);
    checkRoleGuard(demo);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    dbStore.saveProfile(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        expectedRole,
        roleMismatch,
        roleMismatchMessage,
        clearRoleMismatch,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
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
