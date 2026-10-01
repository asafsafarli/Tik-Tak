import { formatPrice } from "@/shared/lib/format-price";

export function formatSubtotal(total: string, deliveryFee: string) {
  const fee = Number(deliveryFee) > 0 ? formatPrice(deliveryFee) : "pulsuz";
  return `${formatPrice(total)}/${fee}`;
}
