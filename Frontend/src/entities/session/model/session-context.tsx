"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { tokenStorage } from "@/shared/lib/token-storage";
import {
  fetchProfile,
  login as loginRequest,
  signup as signupRequest,
} from "../api/session";
import type { Profile } from "./types";

interface SessionContextValue {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  signup: (fullName: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  // Token varsa profil çəkilənə qədər "yüklənir" sayılır.
  const [isLoading, setIsLoading] = useState(
    () => typeof window !== "undefined" && !!tokenStorage.getAccessToken(),
  );

  useEffect(() => {
    if (typeof window === "undefined" || !tokenStorage.getAccessToken()) return;
    fetchProfile()
      .then(setProfile)
      // 401/token-bitmə hallarını `apiFetch` özü idarə edir (refresh cəhd
      // edir, alınmasa özü /login-ə yönləndirib tokeni silir) — bura düşən
      // demək olar hər şey müvəqqəti infrastruktur xətasıdır (502, şəbəkə).
      // Tokeni silmirik ki, API qayıdandan sonra istifadəçi yenidən login
      // etməli olmasın.
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const { tokens, profile: nextProfile } = await loginRequest(phone, password);
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);
    setProfile(nextProfile);
  }, []);

  const signup = useCallback(
    async (fullName: string, phone: string, password: string) => {
      await signupRequest(fullName, phone, password);
      // Backend qeydiyyatdan sonra token qaytarmır — dərhal login edirik.
      await login(phone, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    tokenStorage.clear();
    setProfile(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        profile,
        isAuthenticated: profile !== null,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
