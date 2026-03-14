"use client"

import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/org-dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
  }, [])

  if (!data) return <div className="p-6">Loading...</div>

  const orgs = data.orgs.filter((o: any) => o.org_type === "parent")
  const subs = data.orgs.filter((o: any) => o.org_type === "sub")

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">BLVE Admin Dashboard</h1>

      {/* ============================
          SUMMARY CARDS
      ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Total Routing Pool</h2>
          <p className="text-3xl font-bold mt-2">
            ${data.summary.total_pool.toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Total Organizations</h2>
          <p className="text-3xl font-bold mt-2">{data.summary.total_orgs}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Total Members</h2>
          <p className="text-3xl font-bold mt-2">{data.summary.total_members}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Total Transactions</h2>
          <p className="text-3xl font-bold mt-2">{data.summary.total_tx}</p>
        </div>
      </div>

      {/* ============================
          ORG TABLE WITH DROPDOWNS
      ============================ */}
      <div className="bg-white shadow rounded-xl border overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Organization</th>
              <th className="px-4 py-2 text-left">Routing Pool</th>
              <th className="px-4 py-2 text-left">Members</th>
              <th className="px-4 py-2 text-left">Transactions</th>
              <th className="px-4 py-2 text-left">Avg Tx</th>
            </tr>
          </thead>

          <tbody>
            {orgs.map((org: any) => {
              const orgSubs = subs.filter((s: any) => s.parent_org_id === org.id)

              return (
                <>
                  {/* Parent Row */}
                  <tr
                    key={org.id}
                    className="cursor-pointer bg-gray-50 hover:bg-gray-100"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [org.id]: !prev[org.id],
                      }))
                    }
                  >
                    <td className="px-4 py-2 font-semibold">
                      {expanded[org.id] ? "▼" : "▶"} {org.name}
                    </td>
                    <td className="px-4 py-2">${org.routing_pool}</td>
                    <td className="px-4 py-2">{org.member_count}</td>
                    <td className="px-4 py-2">{org.tx_count}</td>
                    <td className="px-4 py-2">{org.tx_avg.toFixed(2)}</td>
                  </tr>

                  {/* Sub-org Rows */}
                  {expanded[org.id] &&
                    orgSubs.map((sub: any) => (
                      <tr key={sub.id} className="bg-white">
                        <td className="px-8 py-2 text-gray-700">{sub.name}</td>
                        <td className="px-4 py-2">${sub.routing_pool}</td>
                        <td className="px-4 py-2">{sub.member_count}</td>
                        <td className="px-4 py-2">{sub.tx_count}</td>
                        <td className="px-4 py-2">{sub.tx_avg.toFixed(2)}</td>
                      </tr>
                    ))}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ============================
          IDENTITY LAYER SECTION
      ============================ */}
      <div className="p-6 bg-white rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">Identity Layer</h2>
        <p className="text-gray-600">
          This section will show identity‑layer metrics, routing pools, and
          org‑level breakdowns.
        </p>
      </div>
    </div>
  )
}
