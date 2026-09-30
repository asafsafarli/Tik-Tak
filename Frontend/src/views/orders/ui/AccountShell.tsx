"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/widgets/site-header";
import { AccountSidebar } from "@/widgets/account-sidebar";
import { Container } from "@/shared/ui/container";
import { useSession } from "@/entities/session";
import { SKIP_AUTH_GUARD } from "@/shared/config/env";

// Sifarişlər səhifələrinin ortaq çərçivəsi — `ProfilePage`-dəki eyni başlıq,
// sidebar və auth guard. `children` render funksiyasıdır ki, sorğu yalnız
// girişli istifadəçi üçün başlasın.
export function AccountShell({ children }: { children: (enabled: boolean) => ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSession();
  const enabled = isAuthenticated || SKIP_AUTH_GUARD;

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !SKIP_AUTH_GUARD) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (!enabled) return null;

  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-6 sm:py-8">
        <Container wide className="flex flex-col gap-3">
          <h1 className="text-[22px] font-bold leading-none text-ink">Hesabım</h1>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <AccountSidebar className="lg:w-[260px] lg:shrink-0 2xl:w-[300px]" />
            <div className="min-w-0 flex-1 rounded-[10px] bg-white p-[30px]">
              {children(enabled)}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
