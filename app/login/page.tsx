'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Handle Supabase OAuth callback (hash fragment)
    const hash = window.location.hash
    if (hash) {
      // Supabase already processes the hash automatically in some cases
      // But to be safe, clear it and check session
      window.location.hash = ''

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.replace('/admin/dashboard')
        } else {
          setError('No session after callback - try logging in again')
        }
      })
    } else {
      // Normal load - check if already logged in
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.replace('/admin/dashboard')
        }
      })
    }

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace('/admin/dashboard')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">BLVE Admin Login</h1>
        
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

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
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/admin/dashboard`}
        />
      </div>
    </div>
  )
}