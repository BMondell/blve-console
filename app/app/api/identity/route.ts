import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch members
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('*')

  // Fetch orgs
  const { data: orgs, error: orgsError } = await supabase
    .from('organizations')
    .select('*')

  // Fetch transactions
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')

  if (membersError || orgsError || txError) {
    return NextResponse.json(
      { error: 'Failed to load identity layer data' },
      { status: 500 }
    )
  }

  // Identity-layer metrics
  const totalMembers = members.length
  const totalOrgs = orgs.length
  const totalTransactions = transactions.length

  // Members per org
  const membersByOrg = orgs.map(org => ({
    org_id: org.id,
    org_name: org.name,
    members: members.filter(m => m.org_id === org.id).length
  }))

  // Routing totals per org
  const routingByOrg = orgs.map(org => ({
    org_id: org.id,
    org_name: org.name,
    routing_total: transactions
      .filter(t => t.org_id === org.id)
      .reduce((sum, t) => sum + (t.routing_amount || 0), 0)
  }))

  return NextResponse.json({
    totalMembers,
    totalOrgs,
    totalTransactions,
    membersByOrg,
    routingByOrg
  })
}
