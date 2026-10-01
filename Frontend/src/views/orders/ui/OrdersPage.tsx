"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ORDER_STATUS_LABELS, useMyOrders, type Order } from "@/entities/order";
import { formatDate } from "@/shared/lib/format-date";
import { AccountShell } from "./AccountShell";
import { formatSubtotal } from "../lib/format-subtotal";

const COLUMNS = ["No", "Tarix", "Çatdırılma ünvanı", "Məhsul sayı", "Subtotal/Çatdırılma", "Status", ""];

export function OrdersPage() {
  return <AccountShell>{(enabled) => <OrdersTable enabled={enabled} />}</AccountShell>;
}

function OrdersTable({ enabled }: { enabled: boolean }) {
  const { orders, error, isLoading } = useMyOrders(enabled);

  return (
    <>
      <h2 className="text-[16px] font-normal leading-none text-ink">Sifariş Tarixçəsi</h2>

      {isLoading ? (
        <p className="mt-6 text-[14px] text-muted">Yüklənir...</p>
      ) : error ? (
        <p className="mt-6 text-[14px] text-[#F0847A]">Sifarişlər yüklənmədi, yenidən cəhd edin.</p>
      ) : !orders?.length ? (
        <p className="mt-6 text-[14px] text-muted">Hələ sifarişiniz yoxdur.</p>
      ) : (
        <div className="@container mt-6">
          <ul className="flex flex-col gap-3 @[760px]:hidden">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>

          <table className="hidden w-full border-separate border-spacing-0 text-left text-[13px] leading-none text-ink @[760px]:table">
            <thead>
              <tr>
                {COLUMNS.map((column, index) => (
                  <th
                    key={column || "actions"}
                    className={`h-[46px] whitespace-nowrap bg-[#F4F4F6] px-4 font-normal ${
                      index === 0 ? "rounded-l-[10px]" : ""
                    } ${index === COLUMNS.length - 1 ? "rounded-r-[10px]" : ""}`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-light">
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function itemCount(order: Order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function DetailsLink({ order }: { order: Order }) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="inline-flex items-center gap-0.5 whitespace-nowrap hover:text-leaf"
    >
      detallar
      <ChevronRight className="size-3.5" strokeWidth={1.5} />
    </Link>
  );
}

function StatusLabel({ order }: { order: Order }) {
  return (
    <span className={order.status === "CANCELLED" ? "text-[#F0847A]" : ""}>
      {ORDER_STATUS_LABELS[order.status]}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <li className="flex flex-col gap-2 rounded-[10px] border border-neutral-100 p-4 text-[13px] font-light leading-snug text-ink">
      <div className="flex items-start justify-between gap-3">
        <span className="break-all font-normal">{order.orderNumber}</span>
        <StatusLabel order={order} />
      </div>
      <div className="flex justify-between gap-3 text-muted">
        <span>{formatDate(order.createdAt)}</span>
        <span className="truncate">{order.address}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span>
          {itemCount(order)} məhsul · {formatSubtotal(order.total, order.deliveryFee)}
        </span>
        <DetailsLink order={order} />
      </div>
    </li>
  );
}

function OrderRow({ order }: { order: Order }) {
  const cell = "h-[38px] border-b border-neutral-100 px-4";

  return (
    <tr>
      <td className={`${cell} whitespace-nowrap`}>{order.orderNumber}</td>
      <td className={cell}>{formatDate(order.createdAt)}</td>
      <td className={`${cell} max-w-[140px] truncate`} title={order.address}>
        {order.address}
      </td>
      <td className={cell}>{itemCount(order)}</td>
      <td className={`${cell} whitespace-nowrap`}>{formatSubtotal(order.total, order.deliveryFee)}</td>
      <td className={cell}>
        <StatusLabel order={order} />
      </td>
      <td className={`${cell} text-right`}>
        <DetailsLink order={order} />
      </td>
    </tr>
  );
}
