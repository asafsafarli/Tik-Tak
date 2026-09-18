import type { Metadata } from "next";
import { BasketPage } from "@/views/basket";

export const metadata: Metadata = {
  title: "Səbətim — TIK TAK",
};

export default function Page() {
  return <BasketPage />;
}
