"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart } from "lucide-react";
import { SiteHeader } from "@/widgets/site-header";
import { CategoryPromo } from "@/widgets/category-promo";
import { CategorySidebar, useVisibleCategories } from "@/widgets/category-sidebar";
import { CartSidebar } from "@/widgets/cart-sidebar";
import { Container } from "@/shared/ui/container";
import { CART_COLUMN, STOREFRONT_COLUMNS } from "@/shared/config/layout";
import { QuantityStepper } from "@/shared/ui/quantity-stepper";
import { useBasket } from "@/entities/basket";
import { useFavorite } from "@/entities/favorite";
import {
  FALLBACK_PRODUCTS,
  getProduct,
  peekProduct,
  peekProducts,
  unitLabel,
  type Product,
} from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { ProductImageModal } from "./ProductImageModal";

function initialProduct(productId: number): Product {
  return (
    peekProduct(productId) ??
    peekProducts({ limit: 100 })?.find((product) => product.id === productId) ??
    FALLBACK_PRODUCTS.find((product) => product.id === productId) ??
    FALLBACK_PRODUCTS[0]
  );
}

export function ProductDetailPage({ productId }: { productId: number }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product>(() => initialProduct(productId));
  const [selectedQty, setSelectedQty] = useState(1);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let active = true;
    getProduct(productId)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const { visibleCategories } = useVisibleCategories();
  const { addOne } = useBasket();
  const { isFavorite, toggle } = useFavorite();
  const favorite = isFavorite(product.id);

  return (
    <>
      <SiteHeader variant="storefront" wide />
      <main className="flex-1 overflow-x-hidden bg-[#F4F4F6] py-8 sm:py-10">
        <Container wide className="flex flex-col gap-5">
          <nav
            aria-label="Breadcrumb"
            className="text-[20px] font-normal leading-none text-ink"
          >
            <Link href="/" className="hover:opacity-70">
              Ana səhifə
            </Link>
            {" / "}
            <Link href={`/category/${product.category.id}`} className="hover:opacity-70">
              {product.category.name}
            </Link>
          </nav>

          <div className={STOREFRONT_COLUMNS}>
            <div className="flex flex-col gap-5">
              <CategorySidebar
                categories={visibleCategories}
                activeCategoryId={product.category.id}
              />
              <CategoryPromo />
            </div>

            <div className="@container min-w-0 rounded-[10px] bg-white p-5 shadow-[0px_0px_10px_0px_#0000001C] sm:p-8">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-neutral-200/70"
                >
                  <ArrowLeft className="size-4" />
                  geri qayıt
                </button>

                <button
                  type="button"
                  onClick={() => toggle(product)}
                  aria-label={favorite ? "Siyahımdan çıxar" : "Siyahıma əlavə et"}
                  aria-pressed={favorite}
                  className={`flex size-12 items-center justify-center rounded-full transition-colors ${
                    favorite ? "text-[#F0847A]" : "text-ink hover:bg-neutral-100"
                  }`}
                >
                  <Heart className="size-7" fill={favorite ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-8 @[560px]:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setIsImageOpen(true);
                  }}
                  aria-label="Şəkli böyüt"
                  className="mx-auto flex aspect-square w-full max-w-[280px] shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg @[560px]:mx-0"
                >
                  {product.img_url ? (
                    <img
                      src={product.img_url}
                      alt={product.title}
                      className="size-full object-contain"
                    />
                  ) : (
                    <span aria-hidden className="text-6xl font-extrabold text-neutral-300">
                      {product.title.charAt(0)}
                    </span>
                  )}
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <h1 className="break-words text-[24px] font-bold leading-tight text-ink">
                    {product.title}
                  </h1>

                  {product.description ? (
                    <p className="text-[14px] leading-relaxed text-muted">
                      {product.description}
                    </p>
                  ) : null}

                  <span className="whitespace-nowrap text-[20px] font-semibold text-ink">
                    {formatPrice(product.price)}
                  </span>

                  <QuantityStepper
                    quantity={selectedQty}
                    unitLabel={unitLabel(product.type)}
                    onIncrement={() => setSelectedQty((qty) => qty + 1)}
                    onDecrement={() => setSelectedQty((qty) => Math.max(1, qty - 1))}
                    className="w-fit bg-neutral-100 px-2 py-1.5"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      for (let i = 0; i < selectedQty; i += 1) addOne(product);
                      setSelectedQty(1);
                    }}
                    className="w-fit whitespace-nowrap rounded-full bg-leaf px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Səbətə əlavə et
                  </button>
                </div>
              </div>
            </div>

            <CartSidebar className={CART_COLUMN} />
          </div>
        </Container>
      </main>

      {isImageOpen ? (
        <ProductImageModal
          imageUrl={product.img_url}
          title={product.title}
          zoom={zoom}
          onZoomChange={setZoom}
          onClose={() => setIsImageOpen(false)}
        />
      ) : null}
    </>
  );
}
