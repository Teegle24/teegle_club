import type { PropertyScope } from '@/types'

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
