"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/widgets/site-header";
import { Container } from "@/shared/ui/container";
import { useSession } from "@/entities/session";
import { useBasket } from "@/entities/basket";
import { checkout, type PaymentMethod } from "@/entities/order";
import { formatPrice } from "@/shared/lib/format-price";
import { SKIP_AUTH_GUARD } from "@/shared/config/env";
import { CheckoutConfirmModal } from "./CheckoutConfirmModal";
import { CheckoutSuccess } from "./CheckoutSuccess";

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: "CASH", label: "Qapıda nağd ödəmə", icon: "/money.svg" },
  { value: "CARD", label: "Qapıda kart ilə ödəmə", icon: "/card.svg" },
];

// Girişsiz istifadəçi checkout edə bilməz (`POST /orders/checkout` auth
// tələb edir) — `FavoritesPage`-dəki eyni naxışla /login-ə yönləndirilir.
export function CheckoutPage() {
  const router = useRouter();
  const { profile, isAuthenticated, isLoading } = useSession();
  const { lines, total, clear } = useBasket();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !SKIP_AUTH_GUARD) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  const closeConfirm = useCallback(() => setIsConfirmOpen(false), []);

  if (!isAuthenticated && !SKIP_AUTH_GUARD) return null;

  if (isDone) {
    return (
      <>
        <SiteHeader variant="storefront" wide />
        <CheckoutSuccess />
      </>
    );
  }

  function openConfirm() {
    if (!profile || lines.length === 0 || isSubmitting) return;
    setError(null);
    setIsConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!profile || lines.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await checkout({
        paymentMethod,
        note,
        address: profile.address ?? "",
        phone: profile.phone,
      });
      clear();
      setIsDone(true);
    } catch {
      setError("Sifariş göndərilmədi, yenidən cəhd edin.");
      setIsConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <span>Sifarişin tamamlanması</span>
          </nav>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
            <div className="min-w-0 flex-1">
              <h1 className="mb-3 text-[24px] font-bold leading-none text-ink">
                Sifarişin tamamlanması
              </h1>

              <div className="flex flex-col gap-8 rounded-[10px] bg-white p-6">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[16px] font-bold leading-none text-ink">Adınız</p>
                      <p className="mt-1.5 text-[14px] font-normal leading-none text-muted">
                        {profile?.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-[16px] font-bold leading-none text-ink">Ünvanınız</p>
                      <p className="mt-1.5 text-[14px] font-normal leading-none text-muted">
                        {profile?.address ?? "Ünvan qeyd olunmayıb"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[16px] font-bold leading-none text-ink">
                        Telefon nömrəniz
                      </p>
                      <p className="mt-1.5 text-[14px] font-normal leading-none text-muted">
                        {profile?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="note" className="text-[16px] font-bold leading-none text-ink">
                      Əlavə qeyd
                    </label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Əlavə qeydiniz varsa buraya daxil edin"
                      className="h-[110px] w-full resize-none rounded-[10px] border border-transparent bg-brand-soft p-4 text-[14px] leading-snug text-ink outline-none transition-colors placeholder:font-light placeholder:text-[#9AA0AC] focus:border-leaf focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-[16px] font-normal leading-none text-ink">
                    Ödəmə metodu seçin:
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentMethod === method.value;
                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setPaymentMethod(method.value)}
                          className={`flex flex-1 items-center justify-between gap-3 rounded-[10px] border px-4 py-3 text-left transition-colors ${
                            active
                              ? "border-leaf bg-[#EEF7E8]"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={method.icon} alt="" aria-hidden className="w-[47px]" />
                            <span
                              className={`text-[15px] font-medium leading-none ${
                                active ? "text-leaf" : "text-ink"
                              }`}
                            >
                              {method.label}
                            </span>
                          </span>
                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              active ? "border-leaf" : "border-neutral-300"
                            }`}
                          >
                            {active ? <span className="size-2.5 rounded-full bg-leaf" /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error ? (
                  <p className="text-[14px] font-normal leading-none text-[#F0847A]">{error}</p>
                ) : null}

                <button
                  type="button"
                  onClick={openConfirm}
                  disabled={isSubmitting || lines.length === 0}
                  className="flex h-[60px] w-[484px] max-w-full items-center justify-center self-center rounded-[10px] bg-ink text-[24px] font-bold leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Sifarişi tamamla
                </button>
              </div>
            </div>

            <aside className="flex w-full flex-col gap-3 lg:w-[375px] lg:shrink-0">
              <h2 className="text-[24px] font-bold leading-none text-ink">Xülasə</h2>
              <div className="flex flex-col gap-4 rounded-[10px] bg-white p-6">
                <ul className="flex flex-col gap-3">
                  {lines.map((line) => (
                    <li
                      key={line.product.id}
                      className="flex items-center justify-between gap-3 text-[14px] leading-none"
                    >
                      <span className="truncate text-ink">
                        {line.quantity} x {line.product.title}
                      </span>
                      <span className="shrink-0 font-medium text-ink">
                        {formatPrice(Number(line.product.price) * line.quantity)}
                      </span>
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
                    <span>Yekun məbləğ</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {isConfirmOpen ? (
        <CheckoutConfirmModal
          isSubmitting={isSubmitting}
          onConfirm={handleConfirm}
          onClose={closeConfirm}
        />
      ) : null}
    </>
  );
}
