import type { Product } from "@/entities/product";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
      {products.map((product) => (
        <li key={product.id} className="flex justify-center">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
