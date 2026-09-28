"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { SiteHeader } from "@/widgets/site-header";
import { Container } from "@/shared/ui/container";
import { useBasket } from "@/entities/basket";
import { formatPrice } from "@/shared/lib/format-price";

export function BasketPage() {
  const { lines, total, addOne, removeAll, clear } = useBasket();
  const isEmpty = lines.length === 0;

  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:py-10">
        <Container wide className="flex flex-col gap-5">
          <nav aria-label="Breadcrumb" className="text-[20px] font-normal leading-none text-ink">
            <Link href="/" className="hover:opacity-70">
              Ana səhifə
            </Link>
            {" / "}
            <span>Səbətim</span>
          </nav>

          {isEmpty ? (
            <BasketEmptyState />
          ) : (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-center justify-between">
                  <h1 className="text-[24px] font-bold leading-none text-ink">Səbətim</h1>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-[14px] font-normal leading-none text-muted transition-opacity hover:opacity-70"
                  >
                    Səbəti təmizlə
                  </button>
                </div>

                <ul className="flex flex-col divide-y divide-neutral-100 rounded-[10px] bg-white px-4 sm:px-5">
                  {lines.map((line) => (
                    <li key={line.product.id} className="flex items-center gap-3 py-4 sm:gap-4 sm:py-5">
                      <span className="flex size-14 shrink-0 items-center sm:size-20 justify-center overflow-hidden rounded-lg">
                        {line.product.img_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={line.product.img_url}
                            alt={line.product.title}
                            className="size-full object-contain"
                          />
                        ) : (
                          <span aria-hidden className="text-2xl font-extrabold text-neutral-300">
                            {line.product.title.charAt(0)}
                          </span>
                        )}
                      </span>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="line-clamp-2 break-words text-[15px] font-bold leading-tight text-ink sm:text-[16px]">
                          {line.product.title}
                        </span>
                        <span className="text-[14px] font-normal leading-none text-muted">
                          {formatPrice(line.product.price)}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 rounded-full bg-[#EEF7E8] p-1 sm:gap-3 sm:p-1.5">
                        <button
                          type="button"
                          onClick={() => removeAll(line.product.id)}
                          aria-label="Səbətdən çıxar"
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-leaf sm:size-9 text-white transition-opacity hover:opacity-90"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <span className="min-w-4 text-center text-[16px] font-medium leading-none text-ink">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addOne(line.product)}
                          aria-label="Artır"
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-leaf sm:size-9 text-white transition-opacity hover:opacity-90"
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="flex w-full flex-col gap-3 lg:w-[544px] lg:shrink-0">
                <h2 className="text-[24px] font-bold leading-none text-ink">Yekun məbləğ</h2>
                <div className="flex w-full flex-col rounded-[10px] bg-white px-5 pt-6 pb-6 sm:px-[30px] sm:pt-[30px] lg:h-[427px] lg:pb-[50px]">
                  <div className="flex flex-col gap-3 text-[16px] leading-none">
                    <div className="flex items-center justify-between text-muted">
                      <span>Ümumi</span>
                      <span className="font-bold text-ink">{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted">
                      <span>Çatdırılma</span>
                      <span className="font-bold text-ink">Pulsuz</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-6 lg:mt-auto">
                    <div className="flex items-center justify-between text-[20px] font-bold leading-none text-ink">
                      <span>Yekun məbləğ</span>
                      <span>{formatPrice(total)}</span>
                    </div>

                    <Link
                      href="/checkout"
                      className="flex h-[60px] w-full items-center justify-center rounded-[10px] bg-[#92D871] text-[18px] font-bold leading-none text-white transition-opacity hover:opacity-90"
                    >
                      Sifarişi tamamla
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}

function BasketEmptyState() {
  return (
    <div className="flex h-[420px] flex-col items-center justify-center gap-4 rounded-[10px] bg-white text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/basket.svg" alt="" aria-hidden className="h-[200px] w-[239px]" />
      <p className="text-[26px] font-bold leading-none text-[#92D871]">Səbətiniz boşdur</p>
      <p className="text-[20px] font-normal leading-none text-center text-[#2F2E41]">
        Sifariş vermək üçün
        <br />
        səbətinizə məhsul əlavə edin
      </p>
    </div>
  );
}
