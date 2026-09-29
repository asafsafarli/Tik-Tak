import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from '@/entities/session'
import { ToastProvider } from '@/shared/ui/toast'
import { queryClient } from './providers/query-client'
import { router } from './routes/router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
