export type PaymentMethod = "CASH" | "CARD";

export interface CheckoutPayload {
  paymentMethod: PaymentMethod;
  note: string;
  address: string;
  phone: string;
}
