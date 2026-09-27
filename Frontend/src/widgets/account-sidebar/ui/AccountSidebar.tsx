"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House } from "lucide-react";
import { UserIcon } from "@/shared/ui/icons";

const ITEMS = [
  { label: "Hesab məlumatlarım", href: "/profile", icon: "user" as const },
  { label: "Sifarişlərim", href: "/orders", icon: "orders" as const },
];

export function AccountSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hesab"
      className={`flex flex-col rounded-[10px] bg-white px-10 py-6 ${className}`}
    >
      {ITEMS.map((item, index) => {
        // `/orders/:id` detalında da "Sifarişlərim" aktiv qalır.
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-4 py-4 text-[20px] font-normal leading-none transition-colors ${
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
    </nav>
  );
}
