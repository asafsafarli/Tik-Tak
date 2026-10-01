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
  clear: () => void;
  reset: () => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

function toLines(basket: BasketResponse): BasketLine[] {
  return basket.items.map((item) => ({
    product: item.product,
    quantity: item.quantity,
  }));
}

type Updater = (current: BasketLine[]) => BasketLine[];

interface Messages {
  success?: string;
  error?: string;
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const { hasSession } = useSession();
  const router = useRouter();
  const { show } = useToast();
  const [lines, setLines] = useState<BasketLine[]>([]);
  const linesRef = useRef(lines);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());
  const pendingRef = useRef(0);
  const generationRef = useRef(0);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const [trackedSession, setTrackedSession] = useState(hasSession);
  if (trackedSession !== hasSession) {
    setTrackedSession(hasSession);
    setLines([]);
  }

  useEffect(() => {
    generationRef.current += 1;
    pendingRef.current = 0;
    queueRef.current = Promise.resolve();
    if (!hasSession) return;
    let active = true;
    getBasket()
      .then((data) => {
        if (active && pendingRef.current === 0) setLines(toLines(data));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hasSession]);

  const syncFromServer = useCallback((generation: number) => {
    getBasket()
      .then((data) => {
        if (generation === generationRef.current && pendingRef.current === 0) {
          setLines(toLines(data));
        }
      })
      .catch(() => {});
  }, []);

  const mutate = useCallback(
    (update: Updater, request: () => Promise<BasketResponse>, messages: Messages) => {
      const generation = generationRef.current;
      setLines(update);
      pendingRef.current += 1;
      queueRef.current = queueRef.current.then(request).then(
        (data) => {
          if (generation !== generationRef.current) return;
          pendingRef.current -= 1;
          if (pendingRef.current === 0) setLines(toLines(data));
          if (messages.success) show(messages.success);
        },
        () => {
          if (generation !== generationRef.current) return;
          pendingRef.current -= 1;
          if (messages.error) show(messages.error, "error");
          if (pendingRef.current === 0) syncFromServer(generation);
        },
      );
    },
    [show, syncFromServer],
  );

  const titleOf = useCallback(
    (productId: number) =>
      linesRef.current.find((line) => line.product.id === productId)?.product.title,
    [],
  );

  const addOne = useCallback(
    (product: Product) => {
      if (!hasSession) {
        router.push("/register");
        return;
      }
      mutate(
        (current) =>
          current.some((line) => line.product.id === product.id)
            ? current.map((line) =>
                line.product.id === product.id
                  ? { ...line, quantity: line.quantity + 1 }
                  : line,
              )
            : [...current, { product, quantity: 1 }],
        () => addToBasket(product.id),
        {
          success: `"${product.title}" səbətə əlavə edildi`,
          error: "Məhsul səbətə əlavə olunmadı",
        },
      );
    },
    [hasSession, mutate, router],
  );

  const removeOne = useCallback(
    (productId: number) => {
      if (!hasSession) return;
      const title = titleOf(productId);
      mutate(
        (current) =>
          current
            .map((line) =>
              line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line,
            )
            .filter((line) => line.quantity > 0),
        () => removeFromBasket(productId),
        {
          success: title ? `"${title}" səbətdən çıxarıldı` : "Məhsul səbətdən çıxarıldı",
          error: "Məhsul səbətdən çıxarılmadı",
        },
      );
    },
    [hasSession, mutate, titleOf],
  );

  const removeAll = useCallback(
    (productId: number) => {
      if (!hasSession) return;
      const title = titleOf(productId);
      mutate(
        (current) => current.filter((line) => line.product.id !== productId),
        () => removeAllFromBasket(productId),
        {
          success: title ? `"${title}" səbətdən çıxarıldı` : "Məhsul səbətdən çıxarıldı",
          error: "Məhsul səbətdən çıxarılmadı",
        },
      );
    },
    [hasSession, mutate, titleOf],
  );

  const clear = useCallback(() => {
    if (!hasSession) return;
    mutate(() => [], clearBasketRequest, {
      success: "Səbət təmizləndi",
      error: "Səbət təmizlənmədi",
    });
  }, [hasSession, mutate]);

  const reset = useCallback(() => setLines([]), []);

  const value = useMemo<BasketContextValue>(() => {
    const quantities = new Map(lines.map((line) => [line.product.id, line.quantity]));
    return {
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + Number(line.product.price) * line.quantity, 0),
      quantityOf: (productId: number) => quantities.get(productId) ?? 0,
      addOne,
      removeOne,
      removeAll,
      clear,
      reset,
    };
  }, [lines, addOne, removeOne, removeAll, clear, reset]);

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
}
