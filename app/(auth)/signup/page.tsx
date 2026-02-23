import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/AuthForm'

export default async function SignupPage(props: { 
  searchParams: Promise<{ error?: string, message?: string }> 
}) {
  const searchParams = await props.searchParams

  const signup = async (formData: FormData) => {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This ensures the user is redirected correctly after email confirmation
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/signup?error=' + encodeURIComponent(error.message))
    }

    // Usually, you'd show a "Check your email" message here, 
    // but for this assignment, we'll head toward the dashboard path
    return redirect('/dashboard')
  }

  return (
    <AuthForm
      title="Create Account"
      error={searchParams.error}
      message={searchParams.message}
      submitLabel="Sign Up"
      footer={
        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      }
      action={signup}
    />
  )
}