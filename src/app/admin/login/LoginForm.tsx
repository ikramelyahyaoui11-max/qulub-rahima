"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type ActionState } from "../actions";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
      {pending ? "جارٍ الدخول..." : "دخول"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-bold text-brand-green-900">كلمة المرور</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="rounded-lg border border-black/10 bg-brand-cream-100 px-3 py-2.5 text-brand-green-900 outline-none transition-colors focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/20"
        />
      </label>
      {state?.error && <p className="text-sm font-semibold text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
