"use client";

import Link from "next/link";
import { useBasket } from "@/entities/basket";
import { unitLabel, type Product } from "@/entities/product";
import { formatPrice } from "@/shared/lib/format-price";
import { QuantityStepper } from "@/shared/ui/quantity-stepper";

export function ProductCard({ product }: { product: Product }) {
  const { quantityOf, addOne, removeOne } = useBasket();
  const quantity = quantityOf(product.id);

  return (
    <div className="flex h-full w-full max-w-[187px] flex-col gap-2 rounded-[10px] bg-white p-3 text-center shadow-[0px_0px_10px_0px_#0000001C]">
      <Link href={`/product/${product.id}`} className="contents">
        <span className="mx-auto flex aspect-square w-full max-w-[127px] items-center justify-center overflow-hidden rounded-lg">
          {product.img_url ? (
            <img
              src={product.img_url}
              loading="lazy"
              decoding="async"
              alt={product.title}
              className="size-full object-contain"
            />
          ) : (
            <span aria-hidden className="text-2xl font-extrabold text-neutral-300">
              {product.title.charAt(0)}
            </span>
          )}
        </span>

        <div className="flex flex-1 flex-col gap-0.5">
          <span className="line-clamp-2 break-words text-center text-[16px] font-bold leading-tight text-ink">
            {product.title}
          </span>
          <span className="text-[13px] font-semibold text-ink">
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>

      {quantity > 0 ? (
        <QuantityStepper
          quantity={quantity}
          unitLabel={unitLabel(product.type)}
          onIncrement={() => addOne(product)}
          onDecrement={() => removeOne(product.id)}
        />
      ) : (
        <button
          type="button"
          onClick={() => addOne(product)}
          className="rounded-full bg-leaf px-3 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Səbətə əlavə et
        </button>
      )}
    </div>
  );
}
