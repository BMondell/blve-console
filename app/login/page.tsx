'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabaseClient'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const redirectPath = searchParams.get('redirect') || '/admin/dashboard'

    // Clear any leftover hash from callback
    if (window.location.hash) {
      window.location.hash = ''
    }

    // Check if logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(redirectPath)
      }
    })

    // Listen for login success
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace(redirectPath)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [router, searchParams])

  return (
    <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">BLVE Admin Login</h1>

      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              },
            },
          },
        }}
        providers={['google']}
        onlyThirdPartyProviders={true}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
      />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <Suspense fallback={<div>Loading login...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  )
}
