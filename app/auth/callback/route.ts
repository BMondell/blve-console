// app/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectPath = requestUrl.searchParams.get('redirect') || '/';

  if (!code) {
    // No code → redirect anyway (or handle error)
    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
  }

  // Await cookies() FIRST — this resolves the Promise
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore errors from Server Component context
          }
        },
      },
    }
  );

  // Exchange the code for session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Auth exchange error:', error);
    // Optional: redirect to error page
    return NextResponse.redirect(
      new URL('/auth/error?message=' + encodeURIComponent(error.message), requestUrl.origin)
    );
  }

  // Success → redirect to dashboard
  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}