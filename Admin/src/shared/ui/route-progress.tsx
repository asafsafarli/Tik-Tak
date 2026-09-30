import { useLocation } from 'react-router-dom'

export function RouteProgress() {
  const { pathname } = useLocation()

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden>
      <div
        key={pathname}
        className="h-full origin-left animate-route-progress bg-gradient-to-r from-[#92D871] via-[#6FCF54] to-[#3E7BFA]"
      />
    </div>
  )
}
