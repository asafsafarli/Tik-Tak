"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  useMyOrders,
  type Order,
} from "@/entities/order";
import { formatDate, formatTime } from "@/shared/lib/format-date";
import { formatPrice } from "@/shared/lib/format-price";
import { AccountShell } from "./AccountShell";
import { formatSubtotal } from "../lib/format-subtotal";

export function OrderDetailPage({ orderId }: { orderId: number }) {
  return (
    <AccountShell>{(enabled) => <OrderDetail enabled={enabled} orderId={orderId} />}</AccountShell>
  );
}

function OrderDetail({ enabled, orderId }: { enabled: boolean; orderId: number }) {
  const { orders, error, isLoading } = useMyOrders(enabled);
  const order = orders?.find((item) => item.id === orderId);

  if (isLoading) return <p className="text-[14px] text-muted">Yüklənir...</p>;
  if (error) {
    return <p className="text-[14px] text-[#F0847A]">Sifariş yüklənmədi, yenidən cəhd edin.</p>;
  }
  if (!order) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[14px] text-muted">Sifariş tapılmadı.</p>
        <BackLink />
      </div>
    );
  }

  return <OrderInfo order={order} />;
}

function BackLink() {
  return (
    <Link
      href="/orders"
      className="inline-flex items-center gap-1 text-[14px] text-muted hover:text-leaf"
    >
      <ChevronLeft className="size-4" strokeWidth={1.5} />
      Sifarişlərim
    </Link>
  );
}

function OrderInfo({ order }: { order: Order }) {
  const fields = [
    { label: "Sifariş nömrəsi", value: order.orderNumber },
    { label: "Sifariş vaxtı", value: `${formatDate(order.createdAt)}  ${formatTime(order.createdAt)}` },
    { label: "Status", value: ORDER_STATUS_LABELS[order.status] },
    { label: "Çatdırılma ünvanı", value: order.address },
    { label: "Ödəmə metodu", value: PAYMENT_METHOD_LABELS[order.paymentMethod] },
    { label: "Məbləğ/Çatdırılma", value: formatSubtotal(order.total, order.deliveryFee) },
  ];

  return (
    <div className="flex flex-col">
      <BackLink />

      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="text-[13px] font-normal leading-none text-ink">{field.label}</dt>
            <dd className="mt-2 max-w-[200px] whitespace-pre-wrap break-words text-[13px] font-light leading-[1.2] text-ink">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      {order.note ? (
        <div className="mt-7">
          <p className="text-[13px] font-normal leading-none text-ink">Əlavə qeyd</p>
          <p className="mt-2 text-[13px] font-light leading-[1.2] text-ink">{order.note}</p>
        </div>
      ) : null}

      <h3 className="mt-12 text-[13px] font-medium leading-none text-ink">Məhsullar</h3>
      <ul className="mt-2">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-[48px_1fr_auto_auto] items-center gap-4 border-b border-neutral-100 py-2 text-[13px] font-light leading-none text-ink sm:grid-cols-[48px_1fr_1fr_1fr] sm:gap-0"
          >
            <span className="flex size-12 items-center justify-center overflow-hidden">
              {item.product.img_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.product.img_url}
                  alt={item.product.title}
                  className="size-full object-contain"
                />
              ) : (
                <span aria-hidden className="text-[20px] font-extrabold text-neutral-300">
                  {item.product.title.charAt(0)}
                </span>
              )}
            </span>
            <span className="truncate sm:pl-[85px]">{item.product.title}</span>
            <span className="sm:pl-[125px]">{item.quantity}</span>
            <span className="sm:pl-[125px]">{formatPrice(item.total_price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
