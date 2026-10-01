"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/widgets/site-header";
import { AccountSidebar } from "@/widgets/account-sidebar";
import { ProfileForm } from "@/features/profile/edit-form";
import { AvatarCard } from "@/features/profile/avatar-upload";
import { Container } from "@/shared/ui/container";
import { useSession } from "@/entities/session";
import { SKIP_AUTH_GUARD } from "@/shared/config/env";

export function ProfilePage() {
  const router = useRouter();
  const { profile, isAuthenticated, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !SKIP_AUTH_GUARD) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (!isAuthenticated && !SKIP_AUTH_GUARD) return null;

  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-6 sm:py-8">
        <Container wide className="flex flex-col gap-3">
          <h1 className="text-[22px] font-bold leading-none text-ink">Hesabım</h1>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <AccountSidebar className="lg:w-[260px] lg:shrink-0 2xl:w-[300px]" />
            <div className="flex min-w-0 flex-1 flex-col gap-5 xl:flex-row xl:items-start">
              <div className="min-w-0 flex-1">
                <ProfileForm key={profile?.id ?? "empty"} profile={profile} />
              </div>
              <AvatarCard className="xl:w-[240px] xl:shrink-0" />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
