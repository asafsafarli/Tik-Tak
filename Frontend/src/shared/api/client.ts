import { API_BASE_URL } from "@/shared/config/env";
import { tokenStorage } from "@/shared/lib/token-storage";
import { refreshAccessToken } from "./refresh-token";
import type { ApiEnvelope } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | undefined>;
  auth?: boolean;
  redirectOnAuthFail?: boolean;
  token?: string;
  revalidate?: number | false;
}

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function redirectToLogin() {
  tokenStorage.clear();
  if (
    typeof window !== "undefined" &&
    !window.location.pathname.startsWith("/login")
  ) {
    window.location.replace("/login");
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    auth = false,
    redirectOnAuthFail = true,
    token,
    revalidate,
  } = options;
  const url = buildUrl(path, params);

  function send() {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    const headers: Record<string, string> =
      body === undefined || isFormData ? {} : { "Content-Type": "application/json" };
    const bearer = token ?? (auth ? tokenStorage.getAccessToken() : null);
    if (bearer) headers.Authorization = `Bearer ${bearer}`;

    return fetch(url, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      next: revalidate === undefined ? undefined : { revalidate },
    });
  }

  let response = await send();

  if (response.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await send();
    } else if (redirectOnAuthFail) {
      redirectToLogin();
    }
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | { message?: string | string[] }
    | null;

  if (!response.ok) {
    const raw = payload?.message ?? "Sorğu uğursuz oldu";
    throw new ApiError(
      Array.isArray(raw) ? raw.join(", ") : raw,
      response.status,
    );
  }

  return (payload as ApiEnvelope<T>).data;
}
