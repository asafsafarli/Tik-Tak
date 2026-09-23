"use client";

import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { BasketIcon, FavoritesIcon, UserIcon } from "@/shared/ui/icons";
import { HEADER_NAV } from "@/shared/config/site";
import { useSession } from "@/entities/session";
import { useBasket } from "@/entities/basket";
import { SKIP_AUTH_GUARD } from "@/shared/config/env";
import { SiteSearch } from "./SiteSearch";

const ICONS = {
  user: UserIcon,
  favorites: FavoritesIcon,
  basket: BasketIcon,
};

interface SiteHeaderProps {
  // "storefront" — ünvan seçicisi + axtarış sahəsi əlavə olunur (mağaza səhifələri).
  variant?: "landing" | "storefront";
  // Kateqoriya detalı kimi geniş `Container`-dan (bax `wide` prop-u) istifadə
  // edən səhifələrdə header-in də aşağıdakı hissə ilə eyni sol/sağ kənarda
  // olması üçün — digər səhifələr (standart 1200px) təsirlənmir.
  wide?: boolean;
}

export function SiteHeader({ variant = "landing", wide = false }: SiteHeaderProps) {
  const { isAuthenticated, profile } = useSession();
  const { count } = useBasket();
  const storefront = variant === "storefront";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <Container
        wide={wide}
        className={`flex h-[88px] items-center gap-4 ${
          storefront ? "sm:gap-6" : "justify-between"
        }`}
      >
        <Link
          href="/"
          className="shrink-0 font-extrabold leading-none tracking-[0.03em] text-[#2B3043] text-[28px] sm:text-[40px]"
        >
          TIK TAK
        </Link>

        {storefront ? (
          <>
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              className="hidden shrink-0 flex-col rounded-xl bg-neutral-100 px-4 py-2 text-left transition-colors hover:bg-neutral-200/70 md:flex md:max-w-[200px] lg:max-w-[240px]"
            >
              <span className="text-[13px] font-bold leading-tight text-[#2B3043]">
                Ünvan
              </span>
              <span className="truncate text-[12px] leading-tight text-muted">
                {profile?.address ?? "Adres qeyd olunmayıb"}
              </span>
            </Link>

            <SiteSearch />
          </>
        ) : null}

        <nav className="flex shrink-0 items-center gap-4 sm:gap-7">
          {HEADER_NAV.map((item) => {
            const Icon = ICONS[item.icon];
            // Giriş edilməyibsə bu bölmələr login-ə aparır; edilibsə öz
            // səhifəsinə (səhifələr hazır olana qədər `item.href` = "#").
            const href = isAuthenticated || SKIP_AUTH_GUARD ? item.href : "/login";
            return (
              <Link
                key={item.label}
                href={href}
                className="relative flex items-center gap-2 text-[14px] font-normal leading-none tracking-normal text-[#2B3043] transition-opacity hover:opacity-70"
              >
                <span className="relative">
                  <Icon className="h-4 w-auto shrink-0" />
                  {item.icon === "basket" && count > 0 ? (
                    <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-leaf text-[10px] font-semibold text-white">
                      {count}
                    </span>
                  ) : null}
                </span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}
