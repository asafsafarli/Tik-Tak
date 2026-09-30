import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SessionProvider } from "@/entities/session";
import { BasketProvider } from "@/entities/basket";
import { FavoriteProvider } from "@/entities/favorite";
import { ToastProvider } from "@/shared/ui/toast";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIK TAK — Onlayn Supermarket",
  description:
    "TIK TAK — Azərbaycanın onlayn supermarketi. Xüsusi təkliflər, kampaniyalar və gündəlik endirimlər.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="az" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white">
        <ToastProvider>
          <SessionProvider>
            <BasketProvider>
              <FavoriteProvider>{children}</FavoriteProvider>
            </BasketProvider>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
