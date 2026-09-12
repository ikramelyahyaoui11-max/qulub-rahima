"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { saveProductAction, deleteProductAction, type ActionState } from "../../actions";
import { INTENTIONS, type Product, type ProductPrice } from "@/lib/data";

const initialState: ActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
      {pending ? "جارٍ الحفظ..." : label}
    </button>
  );
}

const fieldClass =
  "rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20";

function PriceTierFields({
  legend,
  suffix,
  defaultValue,
}: {
  legend: string;
  suffix: string;
  defaultValue?: ProductPrice;
}) {
  return (
    <fieldset className="rounded-xl border border-black/10 p-3 sm:col-span-2">
      <legend className="px-1 text-sm font-bold text-brand-green-900">{legend}</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-brand-green-900/80">السعر (ج.م)</span>
          <input
            type="number"
            name={`priceEgp${suffix}`}
            min={0}
            step="1"
            defaultValue={defaultValue?.egp}
            required
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-brand-green-900/80">السعر بالدولار ($)</span>
          <input
            type="number"
            name={`priceUsd${suffix}`}
            min={0}
            step="1"
            defaultValue={defaultValue?.usd}
            required
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-brand-green-900/80">السعر بالريال السعودي (ر.س)</span>
          <input
            type="number"
            name={`priceSar${suffix}`}
            min={0}
            step="1"
            defaultValue={defaultValue?.sar}
            required
            className={fieldClass}
          />
        </label>
      </div>
    </fieldset>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const [state, formAction] = useActionState(saveProductAction, initialState);
  const isEdit = Boolean(product);

  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-black/5 bg-white p-5 lg:grid-cols-[1fr_220px]">
      <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {product && <input type="hidden" name="id" value={product.id} />}

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-bold text-brand-green-900">الاسم</span>
          <input type="text" name="name" defaultValue={product?.name} required className={fieldClass} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">الوسم (Tag)</span>
          <input
            type="text"
            name="tag"
            defaultValue={product?.tag}
            placeholder="مثال: الأكثر طلبًا"
            required
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">عدد المستفيدين</span>
          <input
            type="text"
            name="beneficiaries"
            defaultValue={product?.beneficiaries}
            placeholder="مثال: 15 - 18 مستفيد"
            required
            className={fieldClass}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-bold text-brand-green-900">النية الافتراضية</span>
          <select name="defaultIntention" defaultValue={product?.defaultIntention ?? INTENTIONS[0]} className={fieldClass}>
            {INTENTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-bold text-brand-green-900">الوصف</span>
          <textarea
            name="description"
            defaultValue={product?.description}
            required
            rows={2}
            className={fieldClass}
          />
        </label>

        <PriceTierFields legend="السعر بدون إضافات" suffix="" defaultValue={product?.pricing.base} />
        <PriceTierFields legend="السعر مع (5 كيلو) أرز" suffix="5" defaultValue={product?.pricing.rice5kg} />
        <PriceTierFields legend="السعر مع (10 كيلو) أرز" suffix="10" defaultValue={product?.pricing.rice10kg} />

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">الصورة {isEdit ? "(اختياري)" : ""}</span>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            required={!isEdit}
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-sm text-brand-green-900 file:ml-2 file:rounded-full file:border-0 file:bg-brand-green-900 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
        </label>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            name="hasPosterPhoto"
            defaultChecked={product?.hasPosterPhoto ?? true}
            className="h-4 w-4 rounded border-black/20 accent-brand-green-800"
          />
          <span className="font-medium text-brand-green-900">
            صورة ملصق جاهزة (تحتوي على الشعار والنص) — اتركها مفعّلة إذا كانت الصورة مصممة بالكامل
          </span>
        </label>

        {state?.error && <p className="text-sm font-semibold text-red-600 sm:col-span-2">{state.error}</p>}
        {state?.success && <p className="text-sm font-semibold text-brand-green-700 sm:col-span-2">{state.success}</p>}

        <div className="sm:col-span-2">
          <SubmitButton label={isEdit ? "حفظ التعديلات" : "إضافة المنتج"} />
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {product?.photo && (
          <div className="relative h-40 overflow-hidden rounded-xl border border-black/5 bg-brand-cream-100">
            <Image src={product.photo} alt={product.name} fill className="object-contain" />
          </div>
        )}
        {product && (
          <form
            action={deleteProductAction}
            onSubmit={(e) => {
              if (!confirm(`هل أنت متأكد من حذف "${product.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              حذف المنتج
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
