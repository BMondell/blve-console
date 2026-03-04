import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
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

  try {
    // Your actual org-dashboard logic here
    // Example: fetch org-specific data
    const { data: orgData, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', 'example-slug') // replace with your logic

    if (error) throw error

    return NextResponse.json({ success: true, data: orgData })
  } catch (err: any) {
    console.error('Org dashboard error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}