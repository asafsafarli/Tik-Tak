"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";
import { useToast } from "@/shared/ui/toast";
import type { Product } from "@/entities/product";
import {
  addToBasket,
  clearBasket as clearBasketRequest,
  getBasket,
  removeAllFromBasket,
  removeFromBasket,
} from "../api/basket";
import type { BasketLine, BasketResponse } from "./types";

interface BasketContextValue {
  lines: BasketLine[];
  count: number;
  total: number;
  quantityOf: (productId: number) => number;
  addOne: (product: Product) => void;
  removeOne: (productId: number) => void;
  removeAll: (productId: number) => void;
  clear: (options?: { notify?: boolean }) => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

function toLines(basket: BasketResponse): BasketLine[] {
  return basket.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
}

// Səbət Basket API-sına tam güvənir (bax Frontend/API.md) — hər əməliyyat
// server-ə gedir, cavabdakı tam siyahı ilə state əvəzlənir (optimistic update
// yoxdur). Backend basket endpoint-lərinin hamısı auth tələb etdiyindən qonaq
// məhsulu səbətə əlavə edə bilməz — məhsulları görə bilir, amma "əlavə et"
// klikləyəndə qeydiyyatdan keçsin deyə birbaşa /register-ə yönləndirilir.
export function BasketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const router = useRouter();
  const { show } = useToast();
  const [lines, setLines] = useState<BasketLine[]>([]);
  const linesRef = useRef(lines);
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const titleOf = useCallback(
    (productId: number) =>
      linesRef.current.find((line) => line.product.id === productId)?.product.title,
    [],
  );

  // Giriş vəziyyəti dəyişəndə (login/logout) səbət sıfırlanır — render
  // zamanı müqayisə edilir ki, effekt daxilində sinxron `setState` olmasın
  // (React-ın "prop dəyişəndə state-i düzəlt" naxışı, effekt yox).
  const [trackedAuth, setTrackedAuth] = useState(isAuthenticated);
  if (trackedAuth !== isAuthenticated) {
    setTrackedAuth(isAuthenticated);
    setLines([]);
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    getBasket()
      .then((data) => {
        if (active) setLines(toLines(data));
      })
      .catch(() => {
        /* şəbəkə xətası — səbət boş görünür, sonrakı əməliyyatlar yenidən cəhd edir */
      });
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const addOne = useCallback(
    (product: Product) => {
      if (!isAuthenticated) {
        router.push("/register");
        return;
      }
      addToBasket(product.id)
        .then((data) => {
          setLines(toLines(data));
          show(`"${product.title}" səbətə əlavə edildi`);
        })
        .catch(() => show("Məhsul səbətə əlavə olunmadı", "error"));
    },
    [isAuthenticated, router, show],
  );

  const removeOne = useCallback(
    (productId: number) => {
      if (!isAuthenticated) return;
      const title = titleOf(productId);
      removeFromBasket(productId)
        .then((data) => {
          setLines(toLines(data));
          show(title ? `"${title}" səbətdən çıxarıldı` : "Məhsul səbətdən çıxarıldı");
        })
        .catch(() => show("Məhsul səbətdən çıxarılmadı", "error"));
    },
    [isAuthenticated, show, titleOf],
  );

  const removeAll = useCallback(
    (productId: number) => {
      if (!isAuthenticated) return;
      const title = titleOf(productId);
      removeAllFromBasket(productId)
        .then((data) => {
          setLines(toLines(data));
          show(title ? `"${title}" səbətdən çıxarıldı` : "Məhsul səbətdən çıxarıldı");
        })
        .catch(() => show("Məhsul səbətdən çıxarılmadı", "error"));
    },
    [isAuthenticated, show, titleOf],
  );

  // Sifarişdən sonrakı avtomatik təmizləmədə toast göstərilmir — yalnız
  // istifadəçi "Səbəti təmizlə" basanda (`notify: true`).
  const clear = useCallback(
    (options?: { notify?: boolean }) => {
      if (!isAuthenticated) return;
      clearBasketRequest()
        .then((data) => {
          setLines(toLines(data));
          if (options?.notify) show("Səbət təmizləndi");
        })
        .catch(() => {
          if (options?.notify) show("Səbət təmizlənmədi", "error");
        });
    },
    [isAuthenticated, show],
  );

  const quantityOf = useCallback(
    (productId: number) =>
      lines.find((line) => line.product.id === productId)?.quantity ?? 0,
    [lines],
  );

  const count = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );

  const total = useMemo(
    () =>
      lines.reduce(
        (sum, line) => sum + Number(line.product.price) * line.quantity,
        0,
      ),
    [lines],
  );

  return (
    <BasketContext.Provider
      value={{ lines, count, total, quantityOf, addOne, removeOne, removeAll, clear }}
    >
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
