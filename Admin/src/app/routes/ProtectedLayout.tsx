import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { SearchProvider } from '@/shared/lib/search-context'
import { Sidebar } from '@/widgets/sidebar'
import { Topbar } from '@/widgets/topbar'

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Yüklənir...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <SearchProvider>
      <div className="flex min-h-screen w-full flex-col bg-[#F4F4F9]">
        <Topbar />
        <div className="mx-auto flex w-full max-w-[1560px] flex-1 flex-col gap-5 px-4 pt-5 pb-10 lg:flex-row lg:items-start 2xl:px-0">
          <Sidebar />
          <main className="min-w-0 flex-1 rounded-[10px] bg-white p-5 shadow-sm sm:p-10 sm:pt-[29px] lg:min-h-[490px] lg:px-8 2xl:px-10">
            <Suspense fallback={<p className="text-sm text-neutral-500">Yüklənir...</p>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SearchProvider>
  )
}
