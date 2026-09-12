import { getSettings } from "@/lib/store";
import CurrencyForm from "./CurrencyForm";

export default async function AdminCurrencyPage() {
  const settings = await getSettings();

  return (
    <div>
      <h2 className="text-xl font-extrabold text-brand-green-900">أسعار الصرف</h2>
      <p className="mt-1 text-sm text-brand-green-900/60">
        تحكم في سعر تحويل الدولار والريال السعودي مقابل الجنيه المصري
      </p>
      <div className="mt-4">
        <CurrencyForm settings={settings} />
      </div>
    </div>
  );
}
