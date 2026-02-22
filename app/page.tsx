import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            Supabase Auth Starter
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">
            A secure starting point for your Next.js application.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="border border-zinc-300 px-8 py-3 rounded-lg hover:bg-zinc-50 transition-colors text-black"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
