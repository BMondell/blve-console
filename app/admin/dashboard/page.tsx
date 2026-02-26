'use client'

import { useEffect, useState } from 'react'

interface OrgSummary {
  id: string
  name: string
  slug: string
  org_type: string
  routing_pool: string
  sub_org_count: number
  member_count: number
  tx_count: number
  tx_avg: number
}

interface GlobalSummary {
  total_pool: number
  total_orgs: number
  total_members: number
  total_tx: number
  avg_tx: number
}

export default function AdminDashboard() {
  const [orgs, setOrgs] = useState<OrgSummary[]>([])
  const [summary, setSummary] = useState<GlobalSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/overview')
        if (!res.ok) throw new Error(await res.text())
        const json = await res.json()
        if (!json.success) throw new Error(json.error)
        
        setOrgs(json.orgs)
        setSummary(json.summary)
      } catch (err: any) {
        setError(err.message || 'Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  if (loading) return <div className="p-10 text-center text-xl">Loading admin overview...</div>
  if (error) return <div className="p-10 text-red-600 text-center text-xl">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Admin Overview Dashboard</h1>

        {/* Global Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Total Committed</p>
              <p className="text-4xl font-bold text-green-700">${summary.total_pool.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Total Organizations</p>
              <p className="text-4xl font-bold">{summary.total_orgs}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Total Members</p>
              <p className="text-4xl font-bold">{summary.total_members}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Total Transactions</p>
              <p className="text-4xl font-bold">{summary.total_tx}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600 text-sm">Avg Transaction</p>
              <p className="text-4xl font-bold">${summary.avg_tx.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Organizations Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="px-8 py-5 border-b">
            <h2 className="text-2xl font-semibold">All Organizations</h2>
          </div>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase">Routing Pool</th>
                <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase">Sub-orgs</th>
                <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase">Members</th>
                <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase">Transactions</th>
                <th className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase">Avg Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50">
                  <td className="px-8 py-5">
                    <div className="font-medium">{org.name}</div>
                    <div className="text-sm text-gray-500">/{org.slug}</div>
                  </td>
                  <td className="px-8 py-5 capitalize">{org.org_type}</td>
                  <td className="px-8 py-5 text-right font-semibold text-green-700">
                    ${parseFloat(org.routing_pool).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right">{org.sub_org_count}</td>
                  <td className="px-8 py-5 text-right">{org.member_count}</td>
                  <td className="px-8 py-5 text-right">{org.tx_count}</td>
                  <td className="px-8 py-5 text-right font-medium">
                    ${org.tx_avg.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}