import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream-100 px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-black/5 bg-white p-8 shadow-brand">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-900/10 text-brand-green-800">
          <Lock className="h-6 w-6" />
        </span>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-brand-green-900">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-brand-green-900/60">القلوب الرحيمة</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
