import type { Metadata } from "next";
import { CheckoutPage } from "@/views/checkout";

export const metadata: Metadata = {
  title: "Sifarişin tamamlanması — TIK TAK",
};

export default function Page() {
  return <CheckoutPage />;
}
