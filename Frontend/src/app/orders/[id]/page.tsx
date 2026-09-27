import type { Metadata } from "next";
import { OrderDetailPage } from "@/views/orders";

export const metadata: Metadata = {
  title: "Sifariş — TIK TAK",
};

export default async function Page({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  return <OrderDetailPage orderId={Number(id)} />;
}
