import { apiFetch } from "@/shared/api";
import type { CheckoutPayload, Order } from "../model/types";

// Cari basket-dən sifariş yaradır, backend basket-i də təmizləyir (bax
// Frontend/API.md) — çağıran uğur sonrası lokal basket state-ini `clear()`
// ilə sinxronlaşdırmalıdır.
export function checkout(payload: CheckoutPayload) {
  return apiFetch<unknown>("/orders/checkout", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

// Siyahı elementləri artıq `items`-i də daşıyır, ona görə detal səhifəsi də
// bunu istifadə edir — `GET /orders/user/:id` canlıda zərfsiz qayıdır və
// `apiFetch` onu aça bilmir (bax Frontend/API.md).
export function getMyOrders() {
  return apiFetch<Order[]>("/orders/user", { auth: true });
}
