import type { Metadata } from "next";
import { OrdersPage } from "@/views/orders";

export const metadata: Metadata = {
  title: "Sifarişlərim — TIK TAK",
};

export default function Page() {
  return <OrdersPage />;
}
