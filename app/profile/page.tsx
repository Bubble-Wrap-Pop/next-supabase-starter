import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageGradientContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

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

    let avatarUrl = formData.get('existing_avatar_url') as string;
    const avatarFile = formData.get('avatar_file') as File;

    if (avatarFile && avatarFile.size > 0) {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${user?.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatarUrl = data.publicUrl;
    }

    const updates = {
      avatar_url: avatarUrl,
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user?.id)
    if (error) throw error
    
    redirect('/dashboard')
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-white">Edit Profile</h1>
            <Button href="/dashboard" variant="outline" className="!px-4 !py-2">
              Back to Dashboard
            </Button>
          </div>

          <form action={updateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email (Read Only)</label>
              <input value={user.email} disabled className="border p-2 rounded bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="avatar_file" className="text-sm font-medium text-black dark:text-white">Profile Picture</label>
              {profile?.avatar_url && (
                <img src={profile.avatar_url} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
              )}
              <input type="hidden" name="existing_avatar_url" value={profile?.avatar_url || ''} />
              <input 
                  type="file"
                  id="avatar_file" 
                  name="avatar_file" 
                  accept="image/*"
                  className="border p-2 rounded text-black dark:text-white dark:bg-gray-800" 
              />
            </div>

            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  )
}