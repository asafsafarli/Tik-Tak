import { Suspense, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { SearchProvider } from '@/shared/lib/search-context'
import { RouteProgress } from '@/shared/ui/route-progress'
import { StatsLoader } from '@/shared/ui/stats-loader'
import { Sidebar } from '@/widgets/sidebar'
import { Topbar } from '@/widgets/topbar'
import { prefetchPages } from './router'

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useSession()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isAuthenticated) return
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetchPages, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(prefetchPages, 1500)
    return () => window.clearTimeout(id)
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <StatsLoader label="Panel hazırlanır..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <SearchProvider>
      <RouteProgress />
      <div className="flex min-h-screen w-full flex-col bg-[#F4F4F9]">
        <Topbar />
        <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col gap-4 px-3 pt-4 pb-6 sm:px-4 lg:flex-row lg:items-start 2xl:px-0">
          <Sidebar />
          <main className="min-w-0 flex-1 rounded-[10px] bg-white p-4 shadow-sm sm:p-6">
            <div key={pathname} className="animate-page-enter">
              <Suspense fallback={<StatsLoader label="Səhifə yüklənir..." />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </SearchProvider>
  )
}
