import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { CurrencyProvider } from "@/lib/currency";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "القلوب الرحيمة | مؤسسة لتنفيذ المشروعات بأفريقيا",
  description:
    "مؤسسة القلوب الرحيمة لتنفيذ المشروعات بأفريقيا: نتولى شراء الذبيحة وذبحها ونوزيعها على الفقراء والمحتاجين في أفريقيا، ونوثق لكم كل خطوة بالصور والفيديو.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground font-sans">
        <CurrencyProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
