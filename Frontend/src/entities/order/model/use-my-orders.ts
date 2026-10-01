"use client";

import { useEffect, useState } from "react";
import { getMyOrders, peekMyOrders } from "../api/order";
import type { Order } from "./types";

function newestFirst(orders: Order[]) {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function useMyOrders(enabled: boolean) {
  const [orders, setOrders] = useState<Order[] | null>(() => {
    const cached = peekMyOrders();
    return cached ? newestFirst(cached) : null;
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(newestFirst(data));
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { orders, error, isLoading: enabled && orders === null && !error };
}
