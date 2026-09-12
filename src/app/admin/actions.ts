"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getProducts,
  saveProducts,
  getOtherProjects,
  saveOtherProjects,
  saveSettings,
  generateId,
} from "@/lib/store";
import { saveUploadedImage } from "@/lib/uploadImage";
import { isAdminAuthenticated, loginAdmin, logoutAdmin } from "@/lib/adminAuth";
import type { Product, OtherProject, ProductPrice } from "@/lib/data";

export type ActionState = { error?: string; success?: string };

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("غير مصرح لك بهذا الإجراء");
  }
}

function parsePrice(formData: FormData, field: string): number | null {
  const raw = String(formData.get(field) ?? "").trim();
  const value = Number(raw);
  if (!raw || !Number.isFinite(value) || value < 0) return null;
  return value;
}

// ---------- Auth ----------

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const ok = await loginAdmin(password);
  if (!ok) {
    return { error: "كلمة المرور غير صحيحة" };
  }
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await logoutAdmin();
  redirect("/admin/login");
}

// ---------- Products ----------

export async function saveProductAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const beneficiaries = String(formData.get("beneficiaries") ?? "").trim();
  const tag = String(formData.get("tag") ?? "").trim();
  const defaultIntention = String(formData.get("defaultIntention") ?? "").trim();
  const hasPosterPhoto = formData.get("hasPosterPhoto") === "on";
  const imageFile = formData.get("image") as File | null;

  if (!name || !description || !beneficiaries || !tag || !defaultIntention) {
    return { error: "برجاء تعبئة جميع الحقول المطلوبة" };
  }

  const priceFields = {
    base: { egp: "priceEgp", usd: "priceUsd", sar: "priceSar" },
    rice5kg: { egp: "priceEgp5", usd: "priceUsd5", sar: "priceSar5" },
    rice10kg: { egp: "priceEgp10", usd: "priceUsd10", sar: "priceSar10" },
  } as const;

  const pricing: Record<string, ProductPrice> = {};
  for (const [tier, fields] of Object.entries(priceFields)) {
    const egp = parsePrice(formData, fields.egp);
    const usd = parsePrice(formData, fields.usd);
    const sar = parsePrice(formData, fields.sar);
    if (egp === null || usd === null || sar === null) {
      return { error: "برجاء إدخال جميع الأسعار بشكل صحيح (ج.م، $، ر.س) لكل مستوى" };
    }
    pricing[tier] = { egp, usd, sar };
  }

  const products = await getProducts();
  const isEdit = Boolean(id);
  const existing = isEdit ? products.find((p) => p.id === id) : undefined;
  if (isEdit && !existing) {
    return { error: "المنتج غير موجود" };
  }

  let photo = existing?.photo ?? "";
  try {
    const uploaded = await saveUploadedImage(imageFile, "products", id || generateId("product"));
    if (uploaded) photo = uploaded;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "تعذر رفع الصورة" };
  }
  if (!photo) {
    return { error: "برجاء اختيار صورة للمنتج" };
  }

  const product: Product = {
    id: existing?.id ?? generateId("product"),
    badge: name,
    name,
    description,
    beneficiaries,
    tag,
    rating: existing?.rating ?? 5,
    defaultIntention,
    pricing: pricing as Product["pricing"],
    photo,
    hasPosterPhoto,
  };

  const next = isEdit
    ? products.map((p) => (p.id === product.id ? product : p))
    : [...products, product];

  await saveProducts(next);
  revalidatePath("/", "layout");

  return { success: isEdit ? "تم حفظ التعديلات" : "تمت إضافة المنتج" };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const products = await getProducts();
  await saveProducts(products.filter((p) => p.id !== id));
  revalidatePath("/", "layout");
}

// ---------- Other projects ----------

export async function saveOtherProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const imageFile = formData.get("image") as File | null;

  if (!name || !description || !category || !priceRaw) {
    return { error: "برجاء تعبئة جميع الحقول المطلوبة" };
  }
  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "السعر غير صالح" };
  }

  const projects = await getOtherProjects();
  const isEdit = Boolean(id);
  const existing = isEdit ? projects.find((p) => p.id === id) : undefined;
  if (isEdit && !existing) {
    return { error: "العنصر غير موجود" };
  }

  let photo = existing?.photo;
  try {
    const uploaded = await saveUploadedImage(imageFile, "other-projects", id || generateId("other"));
    if (uploaded) photo = uploaded;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "تعذر رفع الصورة" };
  }

  const project: OtherProject = {
    id: existing?.id ?? generateId("other"),
    category,
    name,
    description,
    price,
    photo,
  };

  const next = isEdit
    ? projects.map((p) => (p.id === project.id ? project : p))
    : [...projects, project];

  await saveOtherProjects(next);
  revalidatePath("/", "layout");

  return { success: isEdit ? "تم حفظ التعديلات" : "تمت الإضافة" };
}

export async function deleteOtherProjectAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const projects = await getOtherProjects();
  await saveOtherProjects(projects.filter((p) => p.id !== id));
  revalidatePath("/", "layout");
}

// ---------- Currency settings ----------

export async function saveSettingsAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const usdRate = Number(formData.get("usdRate"));
  const sarRate = Number(formData.get("sarRate"));

  if (!Number.isFinite(usdRate) || usdRate <= 0 || !Number.isFinite(sarRate) || sarRate <= 0) {
    return { error: "القيم غير صالحة" };
  }

  await saveSettings({ usdRate, sarRate });
  revalidatePath("/", "layout");

  return { success: "تم حفظ أسعار الصرف" };
}
