import Link from "next/link";
import { Package, HeartHandshake, Coins, ArrowLeft } from "lucide-react";
import { getProducts, getOtherProjects } from "@/lib/store";

export default async function AdminDashboardPage() {
  const [products, otherProjects] = await Promise.all([getProducts(), getOtherProjects()]);

  const cards = [
    {
      href: "/admin/products",
      icon: Package,
      title: "المنتجات",
      description: `${products.length} منتج (بقرة، عجل، ماعز...)`,
    },
    {
      href: "/admin/other-projects",
      icon: HeartHandshake,
      title: "أبواب القلوب الرحيمة الأخرى",
      description: `${otherProjects.length} عنصر (آبار، بطانيات...)`,
    },
    {
      href: "/admin/currency",
      icon: Coins,
      title: "أسعار الصرف",
      description: "تحديث سعر الدولار والريال السعودي",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="card-elevate flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-6"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green-900/10 text-brand-green-800">
            <card.icon className="h-6 w-6" />
          </span>
          <h2 className="text-lg font-extrabold text-brand-green-900">{card.title}</h2>
          <p className="text-sm text-brand-green-900/60">{card.description}</p>
          <span className="mt-auto flex items-center gap-1 text-sm font-semibold text-brand-gold-600">
            إدارة
            <ArrowLeft className="h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}
