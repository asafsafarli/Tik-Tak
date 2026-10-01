export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.sarkhanrahimli.dev/api/tiktak";

export const SKIP_AUTH_GUARD = process.env.NEXT_PUBLIC_SKIP_AUTH_GUARD === "true";
