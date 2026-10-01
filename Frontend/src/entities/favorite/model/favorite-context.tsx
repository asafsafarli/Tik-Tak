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
import type { Product } from "@/entities/product";
import { useToast } from "@/shared/ui/toast";
import { getFavorites, toggleFavorite as toggleFavoriteRequest } from "../api/favorite";

interface FavoriteContextValue {
  products: Product[];
  isFavorite: (productId: number) => boolean;
  toggle: (product: Product) => void;
}

const FavoriteContext = createContext<FavoriteContextValue | null>(null);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const { hasSession } = useSession();
  const router = useRouter();
  const { show } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const productsRef = useRef(products);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const [trackedSession, setTrackedSession] = useState(hasSession);
  if (trackedSession !== hasSession) {
    setTrackedSession(hasSession);
    setProducts([]);
  }

  useEffect(() => {
    if (!hasSession) return;
    let active = true;
    getFavorites()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [hasSession]);

  const toggle = useCallback(
    (product: Product) => {
      if (!hasSession) {
        router.push("/login");
        return;
      }
      const wasFavorite = productsRef.current.some((item) => item.id === product.id);
      setProducts((prev) =>
        wasFavorite ? prev.filter((item) => item.id !== product.id) : [...prev, product],
      );
      toggleFavoriteRequest(product.id)
        .then(() =>
          show(
            wasFavorite
              ? `"${product.title}" siyahıdan çıxarıldı`
              : `"${product.title}" siyahıya əlavə edildi`,
          ),
        )
        .catch(() => {
          show(
            wasFavorite ? "Məhsul siyahıdan çıxarılmadı" : "Məhsul siyahıya əlavə olunmadı",
            "error",
          );
          getFavorites()
            .then(setProducts)
            .catch(() => {});
        });
    },
    [hasSession, router, show],
  );

  const value = useMemo<FavoriteContextValue>(() => {
    const ids = new Set(products.map((product) => product.id));
    return { products, isFavorite: (productId: number) => ids.has(productId), toggle };
  }, [products, toggle]);

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
}
