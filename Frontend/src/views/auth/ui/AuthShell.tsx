"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/entities/session";

type AuthView = "login" | "register";

const TABS: { view: AuthView; href: string; label: string }[] = [
  { view: "login", href: "/login", label: "Daxil ol" },
  { view: "register", href: "/register", label: "Qeydiyyatdan keç" },
];

interface AuthShellProps {
  active: AuthView;
  children: ReactNode;
}

export function AuthShell({ active, children }: AuthShellProps) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="grid min-h-0 flex-1 md:grid-cols-2">
      <aside className="hidden min-h-0 flex-col overflow-hidden bg-leaf md:flex">
        <span className="shrink-0 px-8 pt-8 text-[40px] font-extrabold leading-none tracking-[0.03em] text-[#2B3043] lg:px-12 lg:pt-10 lg:text-[56px] xl:text-[64px]">
          TIK TAK
        </span>
        <div className="relative min-h-0 flex-1">
          <img
            src="/strawberry.webp"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 size-full object-contain object-left"
          />
        </div>
      </aside>

      <div className="flex min-h-0 items-center justify-center overflow-y-auto px-6 py-8 sm:px-10 lg:px-16">
        <div className="w-full max-w-[440px]">
            <nav className="flex justify-center gap-[clamp(1.5rem,6vw,80px)] border-b border-neutral-200">
              {TABS.map((tab) => (
                <Link
                  key={tab.view}
                  href={tab.href}
                  className={`-mb-px whitespace-nowrap border-b-2 pb-3 text-[20px] font-normal leading-none tracking-normal text-[#1A1D28] ${
                    tab.view === active
                      ? "border-[#92D871]"
                      : "border-transparent"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6">{children}</div>

            <p className="mt-4 text-[15px] font-light leading-none text-muted">
              {active === "login" ? (
                <>
                  Hesabın yoxdursa{" "}
                  <Link
                    href="/register"
                    className="font-medium text-[#92D871]"
                  >
                    Qeydiyyatdan keç
                  </Link>
                </>
              ) : (
                <>
                  Hesabın varsa{" "}
                  <Link href="/login" className="font-medium text-[#92D871]">
                    Daxil ol
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
  );
}
