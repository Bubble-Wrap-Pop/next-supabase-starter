import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'

export function AuthForm({
  title,
  error,
  message,
  children,
  submitLabel,
  footer,
}: {
  title: string
  error?: string
  message?: string
  children?: ReactNode
  submitLabel: string
  footer: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-4 p-6">
          <h1 className="text-2xl font-semibold text-center mb-4 text-black">
            {title}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-black">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="border p-2 rounded text-black bg-gray-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-black">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="border p-2 rounded text-black bg-gray-50"
            />
          </div>

          {children}

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors mt-2"
          >
            {submitLabel}
          </button>

          {footer}
        </Card>
      </div>
    </div>
  )
}

