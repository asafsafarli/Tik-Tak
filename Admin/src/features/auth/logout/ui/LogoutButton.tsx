import { lazy, Suspense, useState } from 'react'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { useToast } from '@/shared/ui/toast'

const LogoutConfirmDialog = lazy(() =>
  import('./LogoutConfirmDialog').then((m) => ({ default: m.LogoutConfirmDialog })),
)

export function LogoutButton() {
  const { logout } = useSession()
  const navigate = useNavigate()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  function handleLogout() {
    setOpen(false)
    logout()
    toast({ title: 'Çıxış edildi', description: 'Sessiyanız bağlandı.', variant: 'info' })
    navigate('/login', { replace: true })
  }

  return (
    <>
      <button
        type="button"
        title="Çıxış"
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
        className="flex items-center justify-center gap-1.5 rounded-[8px] px-1 py-2 text-[13px] leading-[100%] font-normal text-neutral-700 transition-colors hover:bg-red-50 hover:text-red-600 sm:gap-2 lg:mt-2 lg:justify-start lg:border-t lg:border-neutral-100 lg:px-3 lg:pt-3.5 lg:pb-2.5 lg:text-[15px]"
      >
        <LogOut className="size-[18px] shrink-0" strokeWidth={1.75} />
        <span>Çıxış</span>
      </button>

      {mounted ? (
        <Suspense fallback={null}>
          <LogoutConfirmDialog open={open} onOpenChange={setOpen} onConfirm={handleLogout} />
        </Suspense>
      ) : null}
    </>
  )
}
