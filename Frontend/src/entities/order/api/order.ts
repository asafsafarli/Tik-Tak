import { apiFetch, cachedRequest, invalidateCache, peekCached } from "@/shared/api";
import type { CheckoutPayload, Order } from "../model/types";

const ORDERS_KEY = "orders:mine";

export async function checkout(payload: CheckoutPayload) {
  const result = await apiFetch<unknown>("/orders/checkout", {
    method: "POST",
    auth: true,
    body: payload,
  });
  invalidateCache(ORDERS_KEY);
  return result;
}

export function getMyOrders() {
  return cachedRequest(ORDERS_KEY, 30_000, () =>
    apiFetch<Order[]>("/orders/user", { auth: true }),
  );
}

export function peekMyOrders() {
  return peekCached<Order[]>(ORDERS_KEY);
}
