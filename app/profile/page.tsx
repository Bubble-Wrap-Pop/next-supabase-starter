import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch existing profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const updateProfile = async (formData: FormData) => {
    'use server'
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    const updates = {
      id: user?.id,
      avatar_url: formData.get('avatar_url'),
    }

    const { error } = await supabase.from('profiles').upsert(updates)
    if (error) throw error
    
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black">Edit Profile</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>

        <form action={updateProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email (Read Only)</label>
            <input value={user.email} disabled className="border p-2 rounded bg-gray-100 text-gray-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="avatar_url" className="text-sm font-medium text-black">Avatar URL</label>
            <input 
                id="avatar_url" 
                name="avatar_url" 
                defaultValue={profile?.avatar_url || ''} 
                className="border p-2 rounded text-black" 
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mt-4">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}