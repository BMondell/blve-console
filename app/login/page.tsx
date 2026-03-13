import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import GoogleLoginButton from './GoogleLoginButton'

export default async function LoginPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return <div className="p-8">You are already logged in.</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <GoogleLoginButton />
    </div>
  )
}
