"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "../api/order";
import type { Order } from "./types";

// Girişli istifadəçinin sifarişləri — ən yenisi yuxarıda.
export function useMyOrders(enabled: boolean) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    getMyOrders()
      .then((data) => {
        if (cancelled) return;
        setOrders(
          [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
        );
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
