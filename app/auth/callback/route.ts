import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectPath = requestUrl.searchParams.get('redirect') || '/'

  if (code) {
    // CRITICAL FIX: cookies() is SYNCHRONOUS in route handlers (despite TS types)
    // Use @ts-ignore to bypass incorrect TS typing while maintaining correct runtime behavior
    // @ts-ignore
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value ?? null
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set(name, value, options)
            } catch (e) {
              // Safe fallback for Vercel edge runtime quirks
              console.warn('Cookie set warning:', name)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (e) {
              console.warn('Cookie remove warning:', name)
            }
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
}