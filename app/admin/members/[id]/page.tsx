"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function MemberDetailPage() {
  const params = useParams() as { id: string }
  const memberId = params.id

  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard")
        const json = await res.json()

        const members = json.members || []
        const orgs = json.orgs || []
        const transactions = json.transactions || []

        const member = members.find((m: any) => m.id === memberId)

        if (!member) {
          setError("Member not found")
          return
        }

        const subOrg = orgs.find((o: any) => o.id === member.org_id)
        const parentOrg = subOrg
          ? orgs.find((o: any) => o.id === subOrg.parent_org_id)
          : null

        const memberTx = transactions.filter(
          (t: any) => t.member_id === memberId
        )

        const routingTotal = memberTx.reduce(
          (sum: number, t: any) => sum + (t.routing_amount || 0),
          0
        )

        setData({
          member,
          subOrg,
          parentOrg,
          memberTx,
          routingTotal,
        })
      } catch (e) {
        console.error(e)
        setError("Failed to load member data")
      }
    }

    load()
  }, [memberId])

  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!data) return <div className="p-6">Loading...</div>

  const { member, subOrg, parentOrg, memberTx, routingTotal } = data

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">{member.name}</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Email" value={member.email} />
        <SummaryCard title="Sub‑Org" value={subOrg?.name || "—"} />
        <SummaryCard title="Parent Org" value={parentOrg?.name || "—"} />
      </div>

      {/* ROUTING IMPACT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Routing Impact"
          value={`$${routingTotal.toFixed(2)}`}
        />
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>

        {memberTx.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions yet.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Routing</th>
                <th className="px-4 py-2 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {memberTx.map((t: any) => (
                <tr key={t.id} className="border-b">
                  <td className="px-4 py-2">${t.amount}</td>
                  <td className="px-4 py-2">${t.routing_amount}</td>
                  <td className="px-4 py-2">
                    {new Date(t.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ title, value }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
