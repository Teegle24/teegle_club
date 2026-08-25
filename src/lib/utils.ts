import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isConfigReady() {
  const api = import.meta.env.VITE_API_BASE_URL?.trim()
  const clerk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim()
  return Boolean(
    api &&
      clerk &&
      clerk !== 'pk_test_replace_me' &&
      !api.includes('api.example.com'),
  )
}

export function missingConfig() {
  const missing: string[] = []
  const api = import.meta.env.VITE_API_BASE_URL?.trim()
  const clerk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim()
  if (!api || api.includes('api.example.com')) missing.push('VITE_API_BASE_URL')
  if (!clerk || clerk === 'pk_test_replace_me') missing.push('VITE_CLERK_PUBLISHABLE_KEY')
  return missing
}
