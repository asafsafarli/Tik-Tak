import Link from "next/link";
import { SiteHeader } from "@/widgets/site-header";
import { Container } from "@/shared/ui/container";

export function NotFoundPage() {
  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:py-10">
        <Container wide className="flex flex-col">
          <div className="flex flex-col items-center gap-8 rounded-[10px] bg-white px-6 py-16 text-center">
            <img
              src="/404.svg"
              alt=""
              aria-hidden
              className="h-auto w-full max-w-[680px]"
            />
            <p className="text-[20px] font-normal sm:text-[24px] lg:whitespace-nowrap leading-[131%] text-center text-[#1A1D28]">
              Səhifə tapılmadı, deyəsən bir problem baş verib!
            </p>
            <Link
              href="/"
              className="flex h-[74px] w-[213px] items-center justify-center rounded-[10px] bg-[#92D871] text-[22px] font-bold leading-none text-white transition-opacity hover:opacity-90"
            >
              Geri qayıt
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
