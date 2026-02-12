import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const supabase = createRouteHandlerClient({ 
      cookies, 
      options: {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    })
    
    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Set cookie domain explicitly
    const session = await supabase.auth.getSession()
    if (session.data.session) {
      const {  { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          // Force cookie to be set for our domain
          document.cookie = `sb-advymimgvnvehcrmpnnq-auth-token=${session.access_token}; domain=blve-console-pcvm.vercel.app; path=/; secure; samesite=none; expires=Fri, 31 Dec 9999 23:59:59 GMT`
        }
      })
      subscription.unsubscribe()
    }
  }
  
  return NextResponse.redirect(requestUrl.origin)
}