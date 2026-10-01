"use client";

import { useEffect, useState } from "react";
import {
  FALLBACK_CATEGORIES,
  getCategories,
  peekCategories,
  type Category,
} from "@/entities/category";
import { FALLBACK_PRODUCTS, getProducts, peekProducts, type Product } from "@/entities/product";

const ALL_PRODUCTS = { limit: 100 };

function categoryIdsOf(products: Product[]) {
  return new Set(products.map((product) => product.category.id));
}

export function useVisibleCategories() {
  const [categories, setCategories] = useState<Category[]>(
    () => peekCategories() ?? FALLBACK_CATEGORIES,
  );

  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => {
        if (active && data.length > 0) setCategories(data);
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, []);

  const [categoryIdsWithProducts, setCategoryIdsWithProducts] = useState(() =>
    categoryIdsOf(peekProducts(ALL_PRODUCTS) ?? FALLBACK_PRODUCTS),
  );

  useEffect(() => {
    let active = true;
    getProducts(ALL_PRODUCTS)
      .then((data) => {
        if (active && data.length > 0) setCategoryIdsWithProducts(categoryIdsOf(data));
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, []);

  return {
    categories,
    visibleCategories: categories.filter((category) =>
      categoryIdsWithProducts.has(category.id),
    ),
  };
}
