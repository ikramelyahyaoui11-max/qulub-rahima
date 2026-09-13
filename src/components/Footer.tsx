import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";
import { BRAND, NAV_LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-brand-green-900 to-brand-green-950 py-14 text-white"
    >
      <div className="pattern-motif-dark absolute inset-0 opacity-20" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 text-center sm:px-6 md:grid-cols-3 md:text-right lg:px-8">
        <div>
          <h3 className="mb-4 text-lg font-bold text-brand-gold-400">تواصل معنا</h3>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <a
              href={`tel:+${BRAND.phone}`}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">+{BRAND.phone}</span>
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              <span dir="ltr">واتساب: +{BRAND.whatsapp}</span>
            </a>
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 md:justify-end">
            <a
              href={BRAND.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-brand-gold-500"
              aria-label="فيسبوك"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-brand-gold-500"
              aria-label="إنستغرام"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-brand-gold-400">روابط سريعة</h3>
          <ul className="flex flex-col items-center gap-2 md:items-end">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={`/${link.href}`} className="text-sm text-white/80 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <Logo variant="light" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">
            نعمل على تنفيذ الذبائح والأضاحي والمشروعات الدينية ونوزيعها على الفقراء في أفريقيا
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pb-28 pt-6 text-center text-xs text-white/50 sm:px-6 md:pb-6 lg:px-8">
        جميع الحقوق محفوظة © 2026 مؤسسة القلوب الرحيمة لتنفيذ المشروعات بأفريقيا
      </div>
    </footer>
  );
}
