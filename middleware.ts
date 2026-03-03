import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Retry getUser() to handle cookie sync delay after login
  let user = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data } = await supabase.auth.getUser()
    user = data.user

    console.log(`Middleware attempt ${attempt} for ${request.nextUrl.pathname} - user: ${user ? user.email : 'none'}`)

    if (user) break

    // Wait 300ms before retry
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    console.log('No user after retries - redirecting to login')
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
