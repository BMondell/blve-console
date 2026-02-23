import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getCachedOrgDashboard, setCachedOrgDashboard } from '@/lib/cache'

// Create a simple Supabase client (no cookies needed for read-only org data)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || 'fiu'

    // Try cache first
    const cached = await getCachedOrgDashboard(slug)
    if (cached) {
      return NextResponse.json({ 
        success: true, 
         cached,
        fromCache: true
      })
    }

    // Fetch from database (no cookies needed - public org data)
    const { data, error } = await supabase
      .from('org_dashboard_view')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return NextResponse.json({ 
        success: false, 
        error: 'Organization not found' 
      }, { status: 404 })
    }

    // Cache the result
    await setCachedOrgDashboard(slug, data)

    return NextResponse.json({ 
      success: true, 
      data,
      fromCache: false
    })
  } catch (error: any) {
    console.error('Org dashboard API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}