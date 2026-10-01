"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { invalidateCache } from "@/shared/api";
import { tokenStorage } from "@/shared/lib/token-storage";
import {
  fetchProfile,
  login as loginRequest,
  signup as signupRequest,
  updateProfile as updateProfileRequest,
} from "../api/session";
import type { Profile, UpdateProfilePayload } from "./types";

interface SessionContextValue {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasSession: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signup: (fullName: string, phone: string, password: string) => Promise<void>;
  logout: (redirectTo?: string) => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [pendingLogoutPath, setPendingLogoutPath] = useState<string | null>(null);
  if (pendingLogoutPath !== null && pathname === pendingLogoutPath) {
    setPendingLogoutPath(null);
    setProfile(null);
  }
  const [isLoading, setIsLoading] = useState(
    () => typeof window !== "undefined" && !!tokenStorage.getAccessToken(),
  );

  useEffect(() => {
    if (typeof window === "undefined" || !tokenStorage.getAccessToken()) return;
    fetchProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const { tokens, profile: nextProfile } = await loginRequest(phone, password);
    invalidateCache();
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
    setProfile(nextProfile);
  }, []);

  const signup = useCallback(
    async (fullName: string, phone: string, password: string) => {
      await signupRequest(fullName, phone, password);
      await login(phone, password);
    },
    [login],
  );

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    setProfile(await updateProfileRequest(payload));
  }, []);

  const logout = useCallback(
    (redirectTo?: string) => {
      tokenStorage.clear();
      invalidateCache();
      if (redirectTo) {
        setPendingLogoutPath(redirectTo);
        router.replace(redirectTo);
      } else {
        setProfile(null);
      }
    },
    [router],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      profile,
      isAuthenticated: profile !== null,
      isLoading,
      hasSession: profile !== null || isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [profile, isLoading, login, signup, logout, updateProfile],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
