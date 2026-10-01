import { apiFetch, cachedRequest, peekCached } from "@/shared/api";
import type { Category } from "../model/types";

const CATEGORIES_KEY = "categories";

export function getCategories() {
  return cachedRequest(CATEGORIES_KEY, 5 * 60_000, () =>
    apiFetch<Category[]>("/categories", { auth: true, redirectOnAuthFail: false }),
  );
}

export function peekCategories() {
  return peekCached<Category[]>(CATEGORIES_KEY);
}
