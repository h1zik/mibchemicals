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
import { CheckCircle2, XCircle } from "lucide-react";

export type AdminFeedbackVariant = "success" | "error";

export type AdminFeedbackPayload = {
  variant: AdminFeedbackVariant;
  message: string;
};

type AdminFeedbackContextValue = {
  showToast: (payload: AdminFeedbackPayload) => void;
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

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<AdminFeedbackPayload | null>(null);
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
      setToast(payload);
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, TOAST_MS);
    },
    [clearTimer],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <AdminFeedbackContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={
            toast.variant === "success"
              ? "pointer-events-auto fixed bottom-5 right-5 z-[200] flex max-w-sm items-start gap-3 rounded-xl border border-emerald-200/90 bg-white px-4 py-3 shadow-lg shadow-neutral-900/10 sm:bottom-6 sm:right-6"
              : "pointer-events-auto fixed bottom-5 right-5 z-[200] flex max-w-sm items-start gap-3 rounded-xl border border-red-200/90 bg-white px-4 py-3 shadow-lg shadow-neutral-900/10 sm:bottom-6 sm:right-6"
          }
        >
          {toast.variant === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
          )}
          <p
            className={`min-w-0 flex-1 text-sm leading-snug ${
              toast.variant === "success" ? "text-emerald-950" : "text-red-950"
            }`}
          >
            {toast.message}
          </p>
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
            onClick={() => {
              clearTimer();
              setToast(null);
            }}
          >
            Tutup
          </button>
        </div>
      ) : null}
    </AdminFeedbackContext.Provider>
  );
}
