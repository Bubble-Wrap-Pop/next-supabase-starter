import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LoginPage(props: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const searchParams = await props.searchParams

  const login = async (formData: FormData) => {
    'use server'
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    const supabase = await createSupabaseServerClient()
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?error=' + encodeURIComponent(error.message))
    }

    return redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form action={login} className="flex flex-col gap-4 w-full max-w-sm p-6 border rounded shadow bg-white">
        <h1 className="text-2xl font-semibold text-center mb-4 text-black">Log In</h1>
        
        {searchParams.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {searchParams.error}
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-black">Email</label>
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
          <label htmlFor="password" name="password" className="text-black">Password</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            placeholder="••••••••"
            required 
            className="border p-2 rounded text-black bg-gray-50" 
          />
        </div>
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors mt-2">
          Log In
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  )
}