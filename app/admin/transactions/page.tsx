import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function TransactionsPage() {
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
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent('/admin/transactions')}`)
  }

  // Fetch transactions - simplified version to debug
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      id,
      created_at,
      amount,
      card_last4,
      member_id,
      merchant_id
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Query error:', error)
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <p className="text-red-600 text-lg">Error loading transactions: {error.message}</p>
        <p className="mt-4 text-gray-600">Check Supabase table name and columns.</p>
      </div>
    )
  }

  // If no rows, show friendly empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">No transactions yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Once payments start flowing through your merchants, they'll appear here with full details: amount, card last 4, member, recruiting org, commission (4%), and net split.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Test Transaction (coming soon)
          </button>
        </div>
      </div>
    )
  }

  // Process (commission calc)
  const processed = transactions.map((tx: any) => {
    const amount = tx.amount
    const commission = amount * 0.04
    const net = amount - commission

    return {
      ...tx,
      commission: commission.toFixed(2),
      net_to_merchant: net.toFixed(2),
      formatted_date: new Date(tx.created_at).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
      }),
      formatted_amount: `$${amount.toFixed(2)}`
    }
  })

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card Last 4</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission (4%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processed.map((tx: any) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.formatted_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.formatted_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">**** **** **** {tx.card_last4 || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.member_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.merchant_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">${tx.commission}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${tx.net_to_merchant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
