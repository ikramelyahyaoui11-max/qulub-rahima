import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Package, HeartHandshake, Coins, ClipboardList } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { logoutAction } from "../actions";

const NAV = [
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/other-projects", label: "أبواب القلوب الرحيمة الأخرى", icon: HeartHandshake },
  { href: "/admin/currency", label: "أسعار الصرف", icon: Coins },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-cream-100">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-extrabold text-brand-green-900">لوحة تحكم القلوب الرحيمة</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-1.5 text-sm font-semibold text-brand-green-900 transition-colors hover:border-brand-gold-500/40 hover:text-brand-gold-600"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full border border-red-200 px-3.5 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
