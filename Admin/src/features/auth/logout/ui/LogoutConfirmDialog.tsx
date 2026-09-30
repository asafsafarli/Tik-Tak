import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import { LogOut } from 'lucide-react'

interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function LogoutConfirmDialog({ open, onOpenChange, onConfirm }: LogoutConfirmDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[16px] bg-white px-6 pt-7 pb-6 text-center shadow-xl outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <span className="flex size-14 items-center justify-center rounded-full bg-red-50">
            <LogOut className="size-6 text-[#EF4444]" strokeWidth={1.75} />
          </span>

          <AlertDialogPrimitive.Title className="mt-4 text-[18px] leading-[130%] font-semibold text-[#2B3043]">
            Hesabdan çıxmaq istədiyinizə əminsiniz?
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="mt-1.5 text-[13px] text-neutral-500">
            Yenidən daxil olmaq üçün telefon və parol lazım olacaq.
          </AlertDialogPrimitive.Description>

          <div className="mt-6 grid w-full grid-cols-2 gap-3">
            <AlertDialogPrimitive.Action
              onClick={onConfirm}
              className="h-11 rounded-[10px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#92D871' }}
            >
              Təsdiqlə
            </AlertDialogPrimitive.Action>
            <AlertDialogPrimitive.Cancel className="h-11 rounded-[10px] border border-[#E6E8EE] bg-white text-[15px] font-semibold text-neutral-500 transition-colors hover:bg-neutral-50">
              İndi yox
            </AlertDialogPrimitive.Cancel>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
