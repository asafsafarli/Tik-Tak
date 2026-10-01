import Link from "next/link";
import type { Category } from "@/entities/category";

interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId: number;
}

export function CategorySidebar({
  categories,
  activeCategoryId,
}: CategorySidebarProps) {
  return (
    <div>
      <h2 className="mb-3 text-[24px] font-bold leading-none text-ink">
        Kateqoriyalar
      </h2>
      <nav
        aria-label="Kateqoriyalar"
        className="w-full rounded-[10px] bg-white p-5 lg:min-h-[348px]"
      >
        <ul className="flex flex-col gap-1">
          {categories.map((category) => {
            const active = category.id === activeCategoryId;
            return (
              <li key={category.id}>
                <Link
                  href={`/category/${category.id}`}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2 text-[14px] transition-colors ${
                    active
                      ? "bg-[#F4F4F6] font-semibold text-ink"
                      : "text-muted hover:bg-[#F4F4F6] hover:text-ink"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
