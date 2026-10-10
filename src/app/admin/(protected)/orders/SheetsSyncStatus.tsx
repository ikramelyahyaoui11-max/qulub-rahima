"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { syncOrdersToSheetsAction, type ActionState } from "../../actions";

const initialState: ActionState = {};

function SyncButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 rounded-full bg-brand-green-800 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-green-900 disabled:opacity-60"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
      {pending ? "جارٍ المزامنة..." : "مزامنة الآن"}
    </button>
  );
}

export default function SheetsSyncStatus({ configured }: { configured: boolean }) {
  const [state, formAction] = useActionState(syncOrdersToSheetsAction, initialState);

  if (!configured) {
    return (
      <div className="flex items-start gap-2.5 rounded-2xl border border-brand-gold-500/30 bg-brand-gold-500/5 p-4 text-sm text-brand-green-900/80">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-600" />
        <p>
          Synchronisation Google Sheets non configurée. Ajoutez{" "}
          <code dir="ltr" className="rounded bg-black/5 px-1 py-0.5 text-xs">
            GOOGLE_SHEETS_CLIENT_EMAIL
          </code>
          ،{" "}
          <code dir="ltr" className="rounded bg-black/5 px-1 py-0.5 text-xs">
            GOOGLE_SHEETS_PRIVATE_KEY
          </code>{" "}
          و{" "}
          <code dir="ltr" className="rounded bg-black/5 px-1 py-0.5 text-xs">
            GOOGLE_SHEETS_SPREADSHEET_ID
          </code>{" "}
          في .env.local لتفعيلها (راجع .env.example).
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-green-700/20 bg-brand-green-700/5 p-4"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-green-900">
        <CheckCircle2 className="h-4 w-4 text-brand-green-700" />
        مزامنة Google Sheets مفعّلة — كل طلب جديد يتسجل تلقائيًا
      </p>
      <div className="flex items-center gap-3">
        {state?.error && <p className="text-xs font-semibold text-red-600">{state.error}</p>}
        {state?.success && <p className="text-xs font-semibold text-brand-green-700">{state.success}</p>}
        <SyncButton />
      </div>
    </form>
  );
}
