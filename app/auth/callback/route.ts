import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // Critical: Set domain/path for Vercel deployments
            const domain = requestUrl.hostname === 'localhost' 
              ? undefined 
              : `.${requestUrl.hostname.split('.').slice(-2).join('.')}`
            
            cookieStore.set(name, value, {
              ...options,
              domain,
              path: '/',
              sameSite: 'lax',
              secure: requestUrl.protocol === 'https:',
            })
          },
          remove(name: string, options: any) {
            const domain = requestUrl.hostname === 'localhost' 
              ? undefined 
              : `.${requestUrl.hostname.split('.').slice(-2).join('.')}`
            
            cookieStore.set(name, '', {
              ...options,
              domain,
              path: '/',
              sameSite: 'lax',
              secure: requestUrl.protocol === 'https:',
              maxAge: 0,
            })
          },
        },
      }
    )

    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard root
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
