"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/widgets/site-header";
import { OrderPromo } from "@/widgets/order-promo";
import { CategoryGrid } from "@/widgets/category-grid";
import { Container } from "@/shared/ui/container";
import {
  FALLBACK_CATEGORIES,
  getCategories,
  peekCategories,
  type Category,
} from "@/entities/category";

export function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>(
    () => peekCategories() ?? FALLBACK_CATEGORIES,
  );

  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => {
        if (active && data.length > 0) setCategories(data);
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:py-10">
        <Container wide>
          <h1 className="sr-only">Kateqoriyalar</h1>
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
            <OrderPromo className="lg:shrink-0" />
            <div className="flex-1">
              <CategoryGrid categories={categories} />
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
