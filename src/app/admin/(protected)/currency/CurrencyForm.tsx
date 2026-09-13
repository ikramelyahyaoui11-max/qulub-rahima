"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveSettingsAction, type ActionState } from "../../actions";
import type { Settings } from "@/lib/store";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
      {pending ? "جارٍ الحفظ..." : "حفظ أسعار الصرف"}
    </button>
  );
}

export default function CurrencyForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState(saveSettingsAction, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4 rounded-2xl border border-black/5 bg-white p-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-brand-green-900">كم جنيهًا مصريًا يساوي 1 دولار أمريكي ($)</span>
        <input
          type="number"
          name="usdRate"
          min={0.01}
          step="0.01"
          defaultValue={settings.usdRate}
          required
          className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-brand-green-900">كم جنيهًا مصريًا يساوي 1 ريال سعودي (ر.س)</span>
        <input
          type="number"
          name="sarRate"
          min={0.01}
          step="0.01"
          defaultValue={settings.sarRate}
          required
          className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-brand-green-900">كم جنيهًا مصريًا يساوي 1 يورو (€)</span>
        <input
          type="number"
          name="eurRate"
          min={0.01}
          step="0.01"
          defaultValue={settings.eurRate}
          required
          className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
        />
      </label>

      <p className="text-xs text-brand-green-900/50">
        هذه الأسعار تُستخدم فقط لتحويل أسعار «أبواب القلوب الرحيمة الأخرى» (الآبار، البطانيات...) عند اختيار
        الزائر للدولار أو اليورو أو الريال السعودي. أما أسعار المنتجات (بقرة، عجل، ماعز...) فتُدخل يدويًا لكل عملة من
        صفحة «المنتجات».
      </p>

      {state?.error && <p className="text-sm font-semibold text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm font-semibold text-brand-green-700">{state.success}</p>}

      <SubmitButton />
    </form>
  );
}
