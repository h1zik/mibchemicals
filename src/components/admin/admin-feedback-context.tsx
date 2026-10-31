"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

export type AdminFeedbackVariant = "success" | "error";

export type AdminFeedbackPayload = {
  variant: AdminFeedbackVariant;
  message: string;
};

type AdminFeedbackContextValue = {
  showToast: (payload: AdminFeedbackPayload) => void;
  /** Form (berdasarkan `id`) yang sedang disimpan — untuk tombol submit di luar elemen form. */
  pendingForms: ReadonlySet<string>;
  setFormPending: (formId: string, pending: boolean) => void;
};

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | null>(null);

const TOAST_MS = 4200;

export function useAdminFeedback(): AdminFeedbackContextValue {
  const ctx = useContext(AdminFeedbackContext);
  if (!ctx) {
    throw new Error("useAdminFeedback must be used within AdminFeedbackProvider");
  }
  return ctx;
}

/** Versi opsional — dipakai komponen yang juga muncul di luar console (mis. login). */
export function useOptionalAdminFeedback(): AdminFeedbackContextValue | null {
  return useContext(AdminFeedbackContext);
}

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(AdminFeedbackPayload & { key: number }) | null>(null);
  const [pendingForms, setPendingForms] = useState<ReadonlySet<string>>(() => new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (payload: AdminFeedbackPayload) => {
      clearTimer();
      setToast({ ...payload, key: Date.now() });
      // Error tetap tampil sampai ditutup agar pesannya sempat dibaca.
      if (payload.variant === "success") {
        timerRef.current = setTimeout(() => {
          setToast(null);
          timerRef.current = null;
        }, TOAST_MS);
      }
    },
    [clearTimer],
  );

  const setFormPending = useCallback((formId: string, pending: boolean) => {
    setPendingForms((prev) => {
      if (prev.has(formId) === pending) return prev;
      const next = new Set(prev);
      if (pending) next.add(formId);
      else next.delete(formId);
      return next;
    });
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo(
    () => ({ showToast, pendingForms, setFormPending }),
    [showToast, pendingForms, setFormPending],
  );

  const success = toast?.variant === "success";

  return (
    <AdminFeedbackContext.Provider value={value}>
      {children}
      <div
        role={success ? "status" : "alert"}
        aria-live={success ? "polite" : "assertive"}
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[200] flex justify-end sm:inset-x-auto sm:bottom-6 sm:right-6"
      >
        {toast ? (
          <div
            key={toast.key}
            className={
              "pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 overflow-hidden rounded-xl border bg-white py-3 pl-4 pr-2 shadow-[0_12px_32px_-12px_rgba(22,36,12,0.35)] " +
              (success ? "border-mib/25" : "border-red-200")
            }
          >
            <span
              className={"-my-3 -ml-4 w-1 shrink-0 self-stretch " + (success ? "bg-mib" : "bg-admin-danger")}
              aria-hidden
            />
            {success ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mib" aria-hidden />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-admin-danger" aria-hidden />
            )}
            <p className="min-w-0 flex-1 py-0.5 text-sm leading-snug text-admin-ink">{toast.message}</p>
            <button
              type="button"
              className="shrink-0 rounded-md p-1.5 text-admin-muted transition hover:bg-admin-canvas hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
              onClick={() => {
                clearTimer();
                setToast(null);
              }}
            >
              <X className="h-4 w-4" aria-hidden />
              <span className="sr-only">Tutup notifikasi</span>
            </button>
          </div>
        ) : null}
      </div>
    </AdminFeedbackContext.Provider>
  );
}
