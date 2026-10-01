"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/shared/ui/container";

const REDIRECT_SECONDS = 4;

export function CheckoutSuccess() {
  const router = useRouter();
  const [remaining, setRemaining] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining === 0) router.replace("/orders");
  }, [remaining, router]);

  return (
    <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:pt-[70px]">
      <Container wide>
        <div className="flex min-h-[480px] flex-col items-center rounded-[10px] bg-white px-6 pt-[81px] pb-16 text-center">
          <img src="/ok.svg" alt="" aria-hidden className="w-[198px] max-w-full" />
          <h1 className="mt-10 text-[20px] font-medium leading-none text-[#1A1D28]">
            Sifariş uğurla tamamlandı
          </h1>
          <p className="mt-3 text-[18px] font-light leading-snug text-[#1A1D28]">
            Əməkdaşlarımız sizinlə əlaqə saxlayıb sifarişinizi göndərəcəklər.
          </p>

          <Link
            href="/orders"
            replace
            className="mt-8 flex h-[46px] w-[220px] max-w-full items-center justify-center rounded-[8px] bg-[#92D871] text-[16px] font-medium leading-none text-white transition-opacity hover:opacity-90"
          >
            Sifarişlərimə keç
          </Link>
          <p className="mt-3 text-[14px] font-light leading-none text-muted" aria-live="polite">
            {remaining} saniyə sonra avtomatik keçid ediləcək
          </p>
        </div>
      </Container>
    </main>
  );
}
