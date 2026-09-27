import { Container } from "@/shared/ui/container";

// Sifariş uğurla göndəriləndən sonra checkout səhifəsinin yerinə göstərilir.
export function CheckoutSuccess() {
  return (
    <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:pt-[70px]">
      <Container>
        <div className="flex min-h-[480px] flex-col items-center rounded-[10px] bg-white px-6 pt-[81px] pb-16 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ok.svg" alt="" aria-hidden className="w-[198px] max-w-full" />
          <h1 className="mt-10 text-[20px] font-medium leading-none text-[#1A1D28]">
            Sifariş uğurla tamamlandı
          </h1>
          <p className="mt-3 text-[18px] font-light leading-snug text-[#1A1D28]">
            Əməkdaşlarımız sizinlə əlaqə saxlayıb sifarişinizi göndərəcəklər.
          </p>
        </div>
      </Container>
    </main>
  );
}
