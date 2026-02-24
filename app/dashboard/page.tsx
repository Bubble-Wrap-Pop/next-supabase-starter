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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-white">User Information</h2>
            <div className="flex items-center gap-6">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-300 dark:border-zinc-700">
                  No Image
                </div>
              )}
              <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <p><span className="font-medium text-zinc-900 dark:text-zinc-300">Email:</span> {user.email}</p>
                <p><span className="font-medium text-zinc-900 dark:text-zinc-300">User ID:</span> {user.id}</p>
                <p><span className="font-medium text-zinc-900 dark:text-zinc-300">Last Sign In:</span> {new Date(user.last_sign_in_at!).toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="flex justify-between items-center">
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