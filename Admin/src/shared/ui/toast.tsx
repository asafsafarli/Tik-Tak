import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, X, type LucideIcon } from 'lucide-react'

type ToastVariant = 'success' | 'info' | 'error'

interface ToastInput {
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastItem extends Required<Omit<ToastInput, 'description'>> {
  id: number
  description?: string
}

const DURATION = 3500

const VARIANTS: Record<ToastVariant, { icon: LucideIcon; color: string }> = {
  success: { icon: CircleCheck, color: '#4CAF50' },
  info: { icon: Info, color: '#3E7BFA' },
  error: { icon: CircleAlert, color: '#EF4444' },
}

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    ({ title, description, variant = 'success' }: ToastInput) => {
      const id = (nextId.current += 1)
      setToasts((current) => [...current.slice(-2), { id, title, description, variant }])
      window.setTimeout(() => dismiss(id), DURATION)
    },
    [dismiss],
  )

  const value = useMemo(() => show, [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 top-3 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:top-5 sm:right-5 sm:items-end"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const { icon: Icon, color } = VARIANTS[toast.variant]

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto relative flex w-full max-w-[360px] animate-toast-in items-start gap-3 overflow-hidden rounded-[12px] border border-[#EEF0F4] bg-white py-3 pr-3 pl-3.5 shadow-lg sm:w-[340px]"
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}14` }}
      >
        <Icon className="size-[18px]" style={{ color }} />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[14px] leading-[120%] font-semibold text-[#2B3043]">{toast.title}</p>
        {toast.description ? (
          <p className="mt-1 text-[13px] leading-[130%] text-neutral-500">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Bağla"
        className="rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
      >
        <X className="size-4" />
      </button>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[3px] w-full origin-left animate-toast-timer"
        style={{ backgroundColor: color, animationDuration: `${DURATION}ms` }}
      />
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
