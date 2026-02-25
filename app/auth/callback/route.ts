import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectPath = requestUrl.searchParams.get('redirect') || '/'

  if (!code) {
    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
  }

  // CRITICAL FOR NEXT.JS 16: MUST AWAIT cookies() to get resolved cookie store
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Safe to ignore edge runtime quirks
              console.warn(`Cookie set failed for ${name}`)
            }
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    console.error('OAuth exchange failed:', error.message)
    return NextResponse.redirect(new URL('/?error=auth_failed', requestUrl.origin))
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
}
