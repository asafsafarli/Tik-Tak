import { useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/session'

export function LogoutButton() {
  const { logout } = useSession()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="shrink-0 whitespace-nowrap py-3 text-left text-[16px] leading-[100%] lg:pt-[27px] lg:pb-0 lg:text-[20px] font-normal tracking-normal text-neutral-800 transition-colors hover:text-red-600"
    >
      Çıxış
    </button>
  )
}
