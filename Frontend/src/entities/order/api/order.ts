import { apiFetch } from "@/shared/api";
import type { CheckoutPayload } from "../model/types";

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
