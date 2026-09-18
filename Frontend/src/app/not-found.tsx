import type { Metadata } from "next";
import { NotFoundPage } from "@/views/not-found";

export const metadata: Metadata = {
  title: "Səhifə tapılmadı — TIK TAK",
};

export default function NotFound() {
  return <NotFoundPage />;
}
