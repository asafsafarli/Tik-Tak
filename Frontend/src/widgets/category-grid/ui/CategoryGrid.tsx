import Link from "next/link";
import type { Category } from "@/entities/category";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/category/${category.id}`}
            className="group flex h-full flex-col items-center gap-2.5 rounded-xl bg-white p-3 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_6px_22px_rgba(0,0,0,0.10)]"
          >
            <span className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
              {category.img_url ? (
                <img
                  src={category.img_url}
                  loading="lazy"
                  decoding="async"
                  alt={category.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span
                  aria-hidden
                  className="text-2xl font-extrabold text-neutral-300"
                >
                  {category.name.charAt(0)}
                </span>
              )}
            </span>
            <span className="pb-0.5 text-[13px] font-medium leading-snug text-ink">
              {category.name}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
