"use client"

import { useEffect, useState } from "react"

export default function IdentityLayer() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/identity")
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <div className="p-4">Loading identity layer...</div>
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Identity Layer</h2>

      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Members</div>
          <div className="text-2xl font-bold">{data.totalMembers}</div>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Organizations</div>
          <div className="text-2xl font-bold">{data.totalOrgs}</div>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Transactions</div>
          <div className="text-2xl font-bold">{data.totalTransactions}</div>
        </div>
      </div>

      {/* Table */}
      <h3 className="text-lg font-semibold mb-2">Org Breakdown</h3>
      <div className="overflow-auto max-h-80 border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Organization</th>
              <th className="p-2 text-left">Members</th>
              <th className="p-2 text-left">Routing Total</th>
            </tr>
          </thead>
          <tbody>
            {data.membersByOrg.map((org: any) => {
              const routing = data.routingByOrg.find(
                (r: any) => r.org_id === org.org_id
              )

              return (
                <tr key={org.org_id} className="border-b">
                  <td className="p-2">{org.org_name}</td>
                  <td className="p-2">{org.members}</td>
                  <td className="p-2">
                    {routing ? routing.routing_total : 0}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
