import type { OrderStatus, PaymentMethod } from "./types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Gözləmədə",
  CONFIRMED: "Təsdiqləndi",
  PREPARING: "Hazırlanır",
  READY: "Hazırdır",
  DELIVERED: "Tamamlandı",
  CANCELLED: "Ləğv edildi",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Qapıda nağd ödəmə",
  CARD: "Qapıda kart ilə ödəmə",
};
