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

  // Use getUser() + small retry for cookie sync
  let user = null
  for (let i = 0; i < 2; i++) {
    const { data } = await supabase.auth.getUser()
    user = data.user
    if (user) break
    await new Promise(r => setTimeout(r, 200)) // 200ms delay
  }

  console.log('Middleware path:', request.nextUrl.pathname, 'User:', user ? user.email : 'none')

  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    console.log('No user - redirecting to login')
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
