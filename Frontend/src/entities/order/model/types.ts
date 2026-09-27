import type { Product } from "@/entities/product";

export type PaymentMethod = "CASH" | "CARD";

export interface CheckoutPayload {
  paymentMethod: PaymentMethod;
  note: string;
  address: string;
  phone: string;
}

// Admin-dəki `OrderStatus` enum-un eynisi (bax Frontend/API.md → Orders).
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  quantity: number;
  total_price: string;
  product: Product;
}

export interface Order {
  id: number;
  orderNumber: string;
  total: string;
  deliveryFee: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  note: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}
