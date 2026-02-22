import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold text-black">Dashboard</h1>
          <form action={signout}>
            <button 
              type="submit" 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </header>

        <main className="grid gap-6">
          <section className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4 text-black">User Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">User ID:</span> {user.id}</p>
              <p><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at!).toLocaleString()}</p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black">Profile Management</h2>
              <p className="text-gray-600">Update your public profile details and avatar.</p>
            </div>
            <Link 
              href="/profile" 
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </section>
        </main>
      </div>
    </div>
  )
}