import { API_BASE_URL } from '@/shared/config/env'
import { tokenStorage } from '@/shared/lib/token-storage'
import { refreshAccessToken } from './refresh-token'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  params?: Record<string, unknown>
  auth?: boolean
}

function buildUrl(path: string, params?: Record<string, unknown>) {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

let redirecting = false

function redirectToLogin() {
  tokenStorage.clear()
  if (redirecting) return
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    redirecting = true
    window.location.assign('/login')
  }
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, auth = true } = options
  const url = buildUrl(path, params)

  function send() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (auth) {
      const token = tokenStorage.getAccessToken()
      if (token) headers.Authorization = `Bearer ${token}`
    }
    return fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  }

  let response = await send()

  if (response.status === 401 && auth) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      response = await send()
    } else {
      redirectToLogin()
    }
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message ?? 'Something went wrong'
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, response.status)
  }

  return data as T
}
