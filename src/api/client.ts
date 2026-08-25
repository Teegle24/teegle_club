import type { PropertyScope } from '@/types'
import { isPropertyAllowed } from '@/types'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

type Primitive = string | number | boolean | null | undefined

export interface ApiRequestOptions {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token: string | null
  scope?: PropertyScope
  allowedPropertyIds?: string[]
  body?: unknown
  searchParams?: Record<string, Primitive>
}

function apiBaseUrl() {
  const base = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '')
  if (!base) {
    throw new ApiError('VITE_API_BASE_URL is not set', 0, null)
  }
  return base
}

function scopeParams(scope?: PropertyScope): Record<string, string> {
  if (!scope) return {}
  if (scope.type === 'rollup') return { scope: 'rollup' }
  return { scope: 'property', propertyId: scope.propertyId }
}

function readErrorMessage(body: unknown, fallback: string) {
  if (typeof body === 'string' && body.trim()) return body
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

export async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  if (
    options.scope?.type === 'property' &&
    options.allowedPropertyIds &&
    !isPropertyAllowed(options.scope, options.allowedPropertyIds)
  ) {
    throw new ApiError(
      'This course is not linked to your account',
      403,
      null,
    )
  }

  const url = new URL(`${apiBaseUrl()}/api/v1${options.path}`)
  const params = {
    ...scopeParams(options.scope),
    ...options.searchParams,
  }

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    url.searchParams.set(key, String(value))
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      readErrorMessage(payload, `Request failed (${response.status})`),
      response.status,
      payload,
    )
  }

  return payload as T
}

export const api = {
  get<T>(
    path: string,
    options: Omit<ApiRequestOptions, 'path' | 'method' | 'body'>,
  ) {
    return apiRequest<T>({ ...options, path, method: 'GET' })
  },
  put<T>(
    path: string,
    body: unknown,
    options: Omit<ApiRequestOptions, 'path' | 'method' | 'body'>,
  ) {
    return apiRequest<T>({ ...options, path, method: 'PUT', body })
  },
  post<T>(
    path: string,
    body: unknown,
    options: Omit<ApiRequestOptions, 'path' | 'method' | 'body'>,
  ) {
    return apiRequest<T>({ ...options, path, method: 'POST', body })
  },
}
