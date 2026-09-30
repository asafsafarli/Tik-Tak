import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedLayout } from './ProtectedLayout'
import { RouteError } from './RouteError'

const loadLogin = () => import('@/pages/login').then((m) => ({ default: m.LoginPage }))
const loadOrders = () => import('@/pages/orders').then((m) => ({ default: m.OrdersPage }))
const loadCampaigns = () => import('@/pages/campaigns').then((m) => ({ default: m.CampaignsPage }))
const loadCategories = () => import('@/pages/categories').then((m) => ({ default: m.CategoriesPage }))
const loadProducts = () => import('@/pages/products').then((m) => ({ default: m.ProductsPage }))
const loadUsers = () => import('@/pages/users').then((m) => ({ default: m.UsersPage }))

const LoginPage = lazy(loadLogin)
const OrdersPage = lazy(loadOrders)
const CampaignsPage = lazy(loadCampaigns)
const CategoriesPage = lazy(loadCategories)
const ProductsPage = lazy(loadProducts)
const UsersPage = lazy(loadUsers)

export function prefetchPages() {
  for (const load of [loadOrders, loadCampaigns, loadCategories, loadProducts, loadUsers]) {
    load().catch(() => {})
  }
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    ),
    errorElement: <RouteError />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Navigate to="/orders" replace /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'campaigns', element: <CampaignsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'users', element: <UsersPage /> },
    ],
  },
])
