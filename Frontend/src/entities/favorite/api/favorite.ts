import { apiFetch } from "@/shared/api";
import type { Product } from "@/entities/product";

export function getFavorites() {
  return apiFetch<Product[]>("/products/favorites", {
    auth: true,
    redirectOnAuthFail: false,
  });
}

export function toggleFavorite(productId: number) {
  return apiFetch<null>(`/products/${productId}/favorite`, {
    method: "POST",
    auth: true,
    redirectOnAuthFail: false,
  });
}
