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

    const removeAvatar = formData.get('remove_avatar') === 'true';
    let avatarUrl = formData.get('existing_avatar_url') as string;
    const avatarFile = formData.get('avatar_file') as File;

    if (removeAvatar) {
      avatarUrl = '';
    } else if (avatarFile && avatarFile.size > 0) {
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
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Profile</h1>
            <Button href="/dashboard" variant="outline" className="!px-4 !py-2">
              Back to Dashboard
            </Button>
          </div>

          <form action={updateProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Email (Read Only)</label>
              <input value={user.email} disabled className="border border-zinc-300 dark:border-zinc-700 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 w-full" />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="avatar_file" className="text-sm font-medium">Profile Picture</label>
              {profile?.avatar_url && (
                <div className="flex flex-col gap-3 mb-2">
                  <img src={profile.avatar_url} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
                  <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    <input type="checkbox" name="remove_avatar" value="true" className="rounded border-zinc-300 dark:border-zinc-700" />
                    Remove current picture
                  </label>
                </div>
              )}
              <input type="hidden" name="existing_avatar_url" value={profile?.avatar_url || ''} />
              <input 
                type="file"
                id="avatar_file" 
                name="avatar_file" 
                accept="image/*"
                className="w-full cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-600 transition-all file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-1 file:text-sm file:font-semibold file:text-zinc-900 hover:file:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:file:bg-zinc-800 dark:file:text-white dark:hover:file:bg-zinc-700"
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