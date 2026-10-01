import type { Product } from "@/entities/product";

export interface BasketLine {
  product: Product;
  quantity: number;
}

export interface BasketResponse {
  items: Array<{
    id: number;
    quantity: number;
    total_price: string;
    product: Product;
  }>;
  total: string;
  count: number;
}
