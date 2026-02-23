import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageGradientContainer'

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
    <PageContainer className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Card className="flex flex-col gap-4 p-6">
          <h1 className="text-2xl font-semibold text-center mb-4 text-black dark:text-white">
            {title}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm dark:bg-green-900 dark:border-green-700 dark:text-green-200">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-black dark:text-white">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="border p-2 rounded text-black bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-black dark:text-white">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="border p-2 rounded text-black bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>

          {children}

          <Button type="submit" className="mt-2">
            {submitLabel}
          </Button>

          {footer}
        </Card>
      </div>
    </PageContainer>
  )
}

