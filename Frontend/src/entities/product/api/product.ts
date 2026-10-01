import { apiFetch, cachedRequest, peekCached } from "@/shared/api";
import type { Product } from "../model/types";

interface GetProductsParams {
  categoryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

const PRODUCTS_TTL = 60_000;

function productsKey({ categoryId, search, page, limit }: GetProductsParams) {
  return `products:${categoryId ?? ""}:${search ?? ""}:${page ?? ""}:${limit ?? ""}`;
}

export function getProducts(params: GetProductsParams = {}) {
  const { categoryId, search, page, limit } = params;
  return cachedRequest(productsKey(params), PRODUCTS_TTL, () =>
    apiFetch<Product[]>("/products", {
      auth: true,
      redirectOnAuthFail: false,
      params: { category_id: categoryId, search, page, limit },
    }),
  );
}

export function peekProducts(params: GetProductsParams = {}) {
  return peekCached<Product[]>(productsKey(params));
}

export function getProduct(id: number) {
  return cachedRequest(`product:${id}`, PRODUCTS_TTL, () =>
    apiFetch<Product>(`/products/${id}`, { auth: true, redirectOnAuthFail: false }),
  );
}

export function peekProduct(id: number) {
  return peekCached<Product>(`product:${id}`);
}
