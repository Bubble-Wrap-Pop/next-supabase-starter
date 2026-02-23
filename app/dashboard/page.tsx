import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageGradientContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()

  // Requirement: Create protected routes that require authentication
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const signout = async () => {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()
    redirect('/')
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold text-black dark:text-white">Dashboard</h1>
          <form action={signout}>
            <Button type="submit" variant="destructive">
              Sign Out
            </Button>
          </form>
        </header>

        <main className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">User Information</h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">User ID:</span> {user.id}</p>
              <p><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at!).toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">Profile Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Update your public profile details and avatar.</p>
            </div>
            <Button href="/profile">
              Edit Profile
            </Button>
          </Card>
        </main>
      </div>
    </PageContainer>
  )
}