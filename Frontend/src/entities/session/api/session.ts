import { apiFetch } from "@/shared/api";
import type { LoginResult, Profile, UpdateProfilePayload } from "../model/types";

export function login(phone: string, password: string) {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: { phone, password },
  });
}

export function signup(full_name: string, phone: string, password: string) {
  return apiFetch<null>("/auth/signup", {
    method: "POST",
    body: { full_name, phone, password },
  });
}

export function fetchProfile() {
  return apiFetch<Profile>("/profile", { auth: true });
}

export function updateProfile(payload: UpdateProfilePayload) {
  return apiFetch<Profile>("/profile", { method: "PUT", auth: true, body: payload });
}
