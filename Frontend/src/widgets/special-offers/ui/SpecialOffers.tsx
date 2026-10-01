import Link from "next/link";
import { Container } from "@/shared/ui/container";
import type { CampaignCard } from "@/entities/campaign";

const TONE: Record<CampaignCard["tone"], string> = {
  stone: "bg-[linear-gradient(135deg,#3a3a3a,#232323)] ring-1 ring-white/5",
  red: "bg-[radial-gradient(circle_at_85%_15%,#b23c3c,transparent_55%),linear-gradient(135deg,#8a2b2b,#611c1c)]",
  dark: "bg-[radial-gradient(circle_at_80%_20%,#3a4056,transparent_55%),linear-gradient(120deg,#2b3043,#1f2330)]",
};

interface SpecialOffersProps {
  offers: CampaignCard[];
}

export function SpecialOffers({ offers }: SpecialOffersProps) {
  return (
    <section className="py-14 sm:py-16">
      <Container>
        <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
          Xüsusi təkliflər!
        </h2>
        <p className="mt-2 text-sm text-muted">
          BRAVO-da hər gün üçün super təklifləri qaçırmayın!
        </p>

        <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-2">
          {offers.map((offer) => (
            <Link
              key={offer.id}
              href={offer.href}
              className={`group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl p-7 text-white transition-transform hover:-translate-y-0.5 sm:min-h-[280px] sm:p-10 ${TONE[offer.tone]}`}
            >
              {offer.imgUrl ? (
                <>
                  <img
                    src={offer.imgUrl}
                    loading="lazy"
                    decoding="async"
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.72)_100%)]"
                  />
                </>
              ) : (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:24px_24px]"
                />
              )}

              <div className="relative">
                <h3 className="max-w-[75%] text-[22px] font-extrabold leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] sm:text-[26px]">
                  {offer.title}
                </h3>
                {offer.text ? (
                  <p className="mt-2 line-clamp-2 max-w-[46ch] text-sm text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] sm:text-base">
                    {offer.text}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
