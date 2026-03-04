'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js' // client-side only
import Link from 'next/link'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Lazy init Supabase client (only runs in browser)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    console.log('Login page mounted - starting session check')

    const redirectPath = searchParams.get('redirect') || '/admin/dashboard'
    console.log('Redirect target from query:', redirectPath)

    // Clear any leftover hash from callback
    if (window.location.hash) {
      console.log('Clearing callback hash fragment')
      window.location.hash = ''
    }

    // Check session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('getSession result:', { hasSession: !!session, error })
      if (session) {
        console.log('Session found - redirecting to:', redirectPath)
        // Small delay to ensure cookie is synced
        setTimeout(() => {
          router.replace(redirectPath)
          // Force full refresh as fallback
          window.location.href = redirectPath
        }, 500)
      } else {
        console.log('No session - showing login UI')
        setLoading(false)
      }
    }).catch(err => {
      console.error('getSession error:', err)
      setError('Session check failed - try again')
      setLoading(false)
    })

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'session present' : 'no session')
      if (session) {
        console.log('Listener detected session - redirecting')
        setTimeout(() => {
          router.replace(redirectPath)
          window.location.href = redirectPath
        }, 500)
      }
    })

    return () => {
      console.log('Cleaning up auth listener')
      listener.subscription.unsubscribe()
    }
  }, [router, searchParams])

  if (loading) return <div className="text-xl">Checking session...</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to BLVE Console</h1>
        
        <p className="text-lg text-gray-700 mb-10">
          Manage your organizations, routing pools, members, and transactions in one place.
        </p>

        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Login</h2>

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
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />
        </div>

        <div className="mt-8">
          <Link 
            href="/?org=mas"
            className="text-blue-600 hover:underline text-lg font-medium"
          >
            View Public Dashboard (MAS)
          </Link>
        </div>

        <p className="mt-12 text-gray-500 text-sm">
          Powered by Supabase & Next.js • © 2026 BLVE
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-xl">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  )
}