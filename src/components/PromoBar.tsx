import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PromoBar() {
  return (
    <div className="bg-gradient-to-l from-brand-green-900 via-brand-green-800 to-brand-green-900 py-2.5 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 text-center text-sm sm:px-6 lg:px-8">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-brand-gold-400" />
          عرض حصري لفترة محدودة – احجز الآن قبل ارتفاع الأسعار
        </span>
        <Link href="/#products" className="btn-primary px-3.5 py-1 text-xs">
          عرض لفترة محدودة
        </Link>
      </div>
    </div>
  );
}
