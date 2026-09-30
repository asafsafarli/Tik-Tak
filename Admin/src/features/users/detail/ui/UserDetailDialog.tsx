import { LayoutGrid, XIcon } from 'lucide-react'
import type { AdminUser } from '@/entities/user'
import { formatDate } from '@/shared/lib/format-date'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/shared/ui/dialog'

interface UserDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AdminUser | null
}

export function UserDetailDialog({ open, onOpenChange, user }: UserDetailDialogProps) {
  if (!user) return null

  const address = user.address?.trim() || 'Qeyd olunmayıb'
  const email = user.email?.trim() || 'Qeyd olunmayıb'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="flex max-h-[calc(100vh-4rem)] w-[calc(100%-2rem)] max-w-[560px] flex-col gap-0 overflow-hidden rounded-[16px] bg-white p-0 shadow-xl sm:max-w-[560px]"
      >
        <div className="flex shrink-0 items-center gap-4 border-b border-[#EDEEF2] px-6 py-4">
          <Avatar name={user.full_name} src={user.img_url} />
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-[19px] leading-[120%] font-semibold text-[#2B3043]">
              {user.full_name}
            </DialogTitle>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-[6px] border border-[#6FCF54] px-2 py-0.5 text-[12px] font-medium text-[#5AB85A]">
              <LayoutGrid className="size-3" />
              {user.role}
            </span>
          </div>
          <DialogClose className="self-start text-[#1A1D28] transition-opacity hover:opacity-60">
            <XIcon className="size-4" />
            <span className="sr-only">Bağla</span>
          </DialogClose>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#F6F7F9] p-5">
          <section className="rounded-[12px] bg-white p-5">
            <p className="text-[15px] font-semibold text-[#2B3043]">İstifadəçi Məlumatları</p>
            <hr className="my-3 border-[#EDEEF2]" />
            <dl className="flex flex-col gap-2.5 text-sm">
              <InfoRow label="Ad Soyad" value={user.full_name} />
              <InfoRow label="Telefon" value={user.phone} />
              <InfoRow label="E-poçt" value={email} />
              <InfoRow label="Ünvan" value={address} />
              <InfoRow label="Rol" value={user.role} />
              <InfoRow label="Qeydiyyat tarixi" value={formatDate(user.created_at)} />
            </dl>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  if (src) {
    return <img src={src} alt="" width={44} height={44} decoding="async" className="size-11 shrink-0 rounded-full object-cover" />
  }
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#4CAF50] text-[17px] font-semibold text-white">
      {initial}
    </span>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-neutral-400">{label} :</dt>
      <dd className="text-[#2B3043]">{value}</dd>
    </div>
  )
}
