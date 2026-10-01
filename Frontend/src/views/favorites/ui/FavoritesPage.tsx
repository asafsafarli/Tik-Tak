"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/widgets/site-header";
import { ProductGrid } from "@/widgets/product-grid";
import { CartSidebar } from "@/widgets/cart-sidebar";
import { Container } from "@/shared/ui/container";
import { useSession } from "@/entities/session";
import { useFavorite } from "@/entities/favorite";
import { SKIP_AUTH_GUARD } from "@/shared/config/env";

export function FavoritesPage() {
  const { isAuthenticated, isLoading } = useSession();
  const { products } = useFavorite();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !SKIP_AUTH_GUARD) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (!isAuthenticated && !SKIP_AUTH_GUARD) return null;

  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:py-10">
        <Container wide className="flex flex-col gap-5">
          <h1 className="text-[24px] font-bold leading-none text-ink">Siyahılarım</h1>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-5">
            <div className="min-w-0 flex-1">
              {products.length > 0 ? (
                <ProductGrid products={products} />
              ) : (
                <p className="text-[16px] text-muted">Siyahınız boşdur.</p>
              )}
            </div>

            <CartSidebar className="lg:w-[375px] lg:shrink-0" />
          </div>
        </Container>
      </main>
    </>
  );
}
