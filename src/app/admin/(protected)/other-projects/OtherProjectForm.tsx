"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { saveOtherProjectAction, deleteOtherProjectAction, type ActionState } from "../../actions";
import type { OtherProject } from "@/lib/data";

const initialState: ActionState = {};
const CATEGORIES = ["يبقى الأثر", "صدقة جارية", "مشروع رزق"];

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
      {pending ? "جارٍ الحفظ..." : label}
    </button>
  );
}

export default function OtherProjectForm({ project }: { project?: OtherProject }) {
  const [state, formAction] = useActionState(saveOtherProjectAction, initialState);
  const isEdit = Boolean(project);

  return (
    <div className="grid grid-cols-1 gap-6 rounded-2xl border border-black/5 bg-white p-5 lg:grid-cols-[1fr_220px]">
      <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {project && <input type="hidden" name="id" value={project.id} />}

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-bold text-brand-green-900">الاسم</span>
          <input
            type="text"
            name="name"
            defaultValue={project?.name}
            required
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">الوسم (التصنيف)</span>
          <input
            type="text"
            name="category"
            list="category-options"
            defaultValue={project?.category}
            required
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
          <datalist id="category-options">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-bold text-brand-green-900">السعر (ج.م)</span>
          <input
            type="number"
            name="price"
            min={1}
            step="1"
            defaultValue={project?.price}
            required
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-bold text-brand-green-900">الوصف</span>
          <textarea
            name="description"
            defaultValue={project?.description}
            required
            rows={2}
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-brand-green-900 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-bold text-brand-green-900">الصورة (اختياري)</span>
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2 text-sm text-brand-green-900 file:ml-2 file:rounded-full file:border-0 file:bg-brand-green-900 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
          <span className="text-xs text-brand-green-900/50">
            بدون صورة، سيظهر العنصر بخلفية ملونة مع الشعار
          </span>
        </label>

        {state?.error && <p className="text-sm font-semibold text-red-600 sm:col-span-2">{state.error}</p>}
        {state?.success && <p className="text-sm font-semibold text-brand-green-700 sm:col-span-2">{state.success}</p>}

        <div className="sm:col-span-2">
          <SubmitButton label={isEdit ? "حفظ التعديلات" : "إضافة"} />
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {project?.photo && (
          <div className="relative h-40 overflow-hidden rounded-xl border border-black/5 bg-brand-cream-100">
            <Image src={project.photo} alt={project.name} fill className="object-cover" />
          </div>
        )}
        {project && (
          <form
            action={deleteOtherProjectAction}
            onSubmit={(e) => {
              if (!confirm(`هل أنت متأكد من حذف "${project.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={project.id} />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              حذف الخدمة
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
