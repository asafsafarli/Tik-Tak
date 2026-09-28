import type { Product } from "@/entities/product";
import { ProductCard } from "./ProductCard";

// Sütun sayı ekran eninə yox, grid-in real eninə görə hesablanır (`auto-fill`):
// hər sütun ən azı 160px olur, kart isə ən çox 187px-ə (Figma) qədər böyüyür.
// Əvvəlki sabit `lg:grid-cols-4` 1024–1440px ekranlarda (sidebar + səbət
// yanında) kartları 40–147px-ə qədər sıxırdı və şəkil kartdan çıxırdı.
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
