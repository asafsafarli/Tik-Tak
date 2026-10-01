"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/shared/ui/container";
import type { CampaignCard } from "@/entities/campaign";

const TONE: Record<CampaignCard["tone"], string> = {
  dark: "bg-[radial-gradient(circle_at_80%_20%,#3a4056,transparent_55%),linear-gradient(120deg,#2b3043,#1f2330)]",
  red: "bg-[radial-gradient(circle_at_15%_85%,#a23a3a,transparent_50%),linear-gradient(120deg,#7c2727,#5e1d1d)]",
  stone: "bg-[linear-gradient(135deg,#3a3a3a,#232323)]",
};

const SWIPE_THRESHOLD = 45;

interface PromoHeroProps {
  slides: CampaignCard[];
}

export function PromoHero({ slides }: PromoHeroProps) {
  const [perView, setPerView] = useState(2);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setPerView(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const maxIndex = Math.max(0, slides.length - perView);
  const clamped = Math.min(index, maxIndex);

  const move = (dir: 1 | -1) =>
    setIndex(Math.min(Math.max(clamped + dir, 0), maxIndex));

  const canSlide = slides.length > perView;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta <= -SWIPE_THRESHOLD) move(1);
    else if (delta >= SWIPE_THRESHOLD) move(-1);
    touchStartX.current = null;
  };

  return (
    <section className="pt-8 sm:pt-10">
      <Container>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="-mx-2 flex touch-pan-y transition-transform duration-500 ease-out sm:-mx-3"
              style={{ transform: `translateX(-${clamped * (100 / perView)}%)` }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex w-full shrink-0 px-2 sm:px-3 md:w-1/2"
                >
                  <article
                    className={`relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden rounded-2xl p-7 text-white sm:min-h-[300px] sm:p-10 lg:min-h-[320px] ${TONE[slide.tone]}`}
                  >
                    {slide.imgUrl ? (
                      <>
                        <img
                          src={slide.imgUrl}
                          alt=""
                          aria-hidden
                          className="pointer-events-none absolute inset-0 size-full object-cover"
                        />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.35)_72%,rgba(0,0,0,0.72)_100%)]"
                        />
                      </>
                    ) : (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:22px_22px]"
                      />
                    )}

                    <Link
                      href={slide.href}
                      aria-hidden
                      tabIndex={-1}
                      className="absolute inset-0"
                    />

                    <div className="pointer-events-none relative">
                      <h2 className="line-clamp-2 text-[26px] font-extrabold leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] sm:text-3xl lg:text-[34px]">
                        {slide.title}
                      </h2>
                      {slide.text ? (
                        <p className="mt-2 line-clamp-2 max-w-[42ch] text-sm text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] sm:text-base">
                          {slide.text}
                        </p>
                      ) : null}
                    </div>

                    <Link
                      href={slide.href}
                      className="relative inline-flex w-fit items-center rounded-lg bg-black/80 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
                    >
                      Ətraflı
                    </Link>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {canSlide ? (
            <>
              <button
                type="button"
                onClick={() => move(-1)}
                disabled={clamped === 0}
                aria-label="Əvvəlki"
                className="absolute top-1/2 -left-3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                disabled={clamped === maxIndex}
                aria-label="Növbəti"
                className="absolute top-1/2 -right-3 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
              >
                <ChevronRight className="size-5" />
              </button>

              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  disabled={clamped === 0}
                  aria-label="Əvvəlki"
                  className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink transition hover:bg-neutral-50 disabled:opacity-40 lg:hidden"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: maxIndex + 1 }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Slayd ${i + 1}`}
                    aria-current={i === clamped}
                    className={`h-1.5 rounded-full transition-all ${
                      i === clamped
                        ? "w-5 bg-brand"
                        : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={clamped === maxIndex}
                  aria-label="Növbəti"
                  className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink transition hover:bg-neutral-50 disabled:opacity-40 lg:hidden"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
