const ACCESS_TOKEN_KEY = "tiktak_access_token";
const REFRESH_TOKEN_KEY = "tiktak_refresh_token";

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export const tokenStorage = {
  getAccessToken: () => read(ACCESS_TOKEN_KEY),
  getRefreshToken: () => read(REFRESH_TOKEN_KEY),
  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
    }
  },
  clear: () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
    }
  },
};
