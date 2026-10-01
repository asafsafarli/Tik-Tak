"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useBasket } from "@/entities/basket";
import { unitLabel } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { QuantityStepper } from "@/shared/ui/quantity-stepper";

export function CartSidebar({ className = "" }: { className?: string }) {
  const { lines, total, addOne, removeOne, removeAll } = useBasket();
  const isEmpty = lines.length === 0;

  return (
    <div className={`w-full max-w-[375px] ${className}`}>
      <h2 className="mb-3 text-[24px] font-bold leading-none text-ink">Səbətim</h2>
      <aside
        className={`flex w-full flex-col rounded-[10px] bg-white p-4 shadow-[0px_0px_10px_0px_#0000001C] ${
          isEmpty ? "h-[520px] items-center justify-center" : "gap-4"
        }`}
      >
        {isEmpty ? (
          <div className="flex flex-col items-center text-center">
            <img src="/basket.svg" alt="" aria-hidden className="h-[200px] w-[239px]" />
            <p className="mt-4 text-[26px] font-bold leading-none text-[#92D871]">
              Səbətiniz boşdur
            </p>
            <p className="mt-[49px] text-[20px] font-normal leading-none text-center text-[#2F2E41]">
              Sifariş vermək üçün
              <br />
              səbətinizə məhsul əlavə edin
            </p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3">
              {lines.map((line) => (
                <li key={line.product.id} className="flex items-center gap-2.5">
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    {line.product.img_url ? (
                      <img
                        src={line.product.img_url}
                        loading="lazy"
                        decoding="async"
                        alt={line.product.title}
                        className="size-full object-contain"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="text-sm font-extrabold text-neutral-300"
                      >
                        {line.product.title.charAt(0)}
                      </span>
                    )}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate text-[13px] font-medium leading-snug text-ink">
                      {line.product.title}
                    </span>
                    <QuantityStepper
                      quantity={line.quantity}
                      unitLabel={unitLabel(line.product.type)}
                      onIncrement={() => addOne(line.product)}
                      onDecrement={() => removeOne(line.product.id)}
                      className="w-fit bg-neutral-100 px-1 py-1"
                    />
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => removeAll(line.product.id)}
                      aria-label="Səbətdən çıxar"
                      className="text-neutral-300 transition-colors hover:text-[#F0847A]"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <span className="text-[13px] font-semibold text-ink">
                      {formatPrice(Number(line.product.price) * line.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-1.5 border-t border-neutral-100 pt-3 text-[13px]">
              <div className="flex items-center justify-between text-muted">
                <span>Ümumi:</span>
                <span className="font-medium text-ink">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Çatdırılma:</span>
                <span className="font-medium text-ink">Pulsuz</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-[15px] font-bold text-ink">
                <span>Yekun məbləğ:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="rounded-xl bg-ink px-4 py-3 text-center text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Sifarişi tamamla
            </Link>
          </>
        )}
      </aside>
    </div>
  );
}
