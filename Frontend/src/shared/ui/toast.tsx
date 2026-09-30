"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";

type ToastTone = "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
}

const TOAST_DURATION = 2500;
const MAX_TOASTS = 3;

const ToastContext = createContext<ToastContextValue | null>(null);

// Eyni mesaj artıq ekrandadırsa yenisi əlavə olunmur, mövcudun vaxtı
// yenilənir — məs. səbətdə "+" ard-arda basılanda toast yığılmasın.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastsRef = useRef<ToastItem[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const nextId = useRef(0);

  const commit = useCallback((next: ToastItem[]) => {
    toastsRef.current = next;
    setToasts(next);
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
      commit(toastsRef.current.filter((toast) => toast.id !== id));
    },
    [commit],
  );

  const show = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const existing = toastsRef.current.find(
        (toast) => toast.message === message && toast.tone === tone,
      );
      const id = existing?.id ?? ++nextId.current;
      clearTimeout(timers.current.get(id));
      timers.current.set(id, setTimeout(() => dismiss(id), TOAST_DURATION));
      if (existing) return;

      const next = [...toastsRef.current, { id, message, tone }];
      next.slice(0, -MAX_TOASTS).forEach((toast) => {
        clearTimeout(timers.current.get(toast.id));
        timers.current.delete(toast.id);
      });
      commit(next.slice(-MAX_TOASTS));
    },
    [commit, dismiss],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:top-24 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.tone === "error" ? "alert" : "status"}
            className="toast-enter pointer-events-auto flex w-full max-w-[360px] items-center gap-3 rounded-[10px] bg-white px-4 py-3 text-[14px] leading-snug text-ink shadow-[0_8px_24px_rgba(43,48,67,0.15)]"
          >
            {toast.tone === "error" ? (
              <CircleAlert className="size-5 shrink-0 text-[#F0847A]" />
            ) : (
              <CircleCheck className="size-5 shrink-0 text-leaf" />
            )}
            <span className="min-w-0 flex-1">{toast.message}</span>
            <button
              type="button"
              aria-label="Bağla"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-muted transition-colors hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
