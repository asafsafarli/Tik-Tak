"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LogOut } from "lucide-react";
import { useSession } from "@/entities/session";
import { UserIcon } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/toast";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

const ITEMS = [
  { label: "Hesab məlumatlarım", href: "/profile", icon: "user" as const },
  { label: "Sifarişlərim", href: "/orders", icon: "orders" as const },
];

export function AccountSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { logout } = useSession();
  const { show } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleLogout() {
    setIsConfirmOpen(false);
    logout("/");
    show("Hesabdan çıxış edildi");
  }

  return (
    <nav
      aria-label="Hesab"
      className={`flex flex-col rounded-[10px] bg-white px-6 py-2 sm:px-8 ${className}`}
    >
      {ITEMS.map((item, index) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 py-4 text-[16px] font-normal leading-none transition-colors ${
              index > 0 ? "border-t border-neutral-100" : ""
            } ${active ? "text-[#92D871]" : "text-ink hover:text-leaf"}`}
          >
            {item.icon === "user" ? (
              <UserIcon className="size-5 shrink-0" />
            ) : (
              <House className="size-5 shrink-0" strokeWidth={1.5} />
            )}
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className="flex items-center gap-3 border-t border-neutral-100 py-4 text-left text-[16px] font-normal leading-none text-[#F0847A] transition-opacity hover:opacity-80"
      >
        <LogOut className="size-5 shrink-0" strokeWidth={1.5} />
        Hesabdan çıx
      </button>

      {isConfirmOpen ? (
        <LogoutConfirmModal onConfirm={handleLogout} onClose={() => setIsConfirmOpen(false)} />
      ) : null}
    </nav>
  );
}
