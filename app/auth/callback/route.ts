import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Callback hit - code present:', !!code)

  if (!code) {
    console.log('No code - redirect to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          console.log('Setting', cookiesToSet.length, 'cookies')
          cookiesToSet.forEach(({ name, value, options }) => {
            // Explicitly set path, secure, sameSite
            response.cookies.set(name, value, {
              ...options,
              path: '/',
              sameSite: 'lax',
              secure: true, // true for production
            })
          })
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Exchange error:', error.message)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }

  console.log('Session set:', session ? 'success' : 'failed', 'User:', session?.user?.email)

  return NextResponse.redirect(new URL('/admin/dashboard', request.url))
}
