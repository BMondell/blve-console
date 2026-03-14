"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function OrgDetailPage() {
  const params = useParams()
  const orgId = params.id

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/org-dashboard`)
      .then((res) => res.json())
      .then((json) => {
        const org = json.orgs.find((o: any) => o.id === orgId)
        const subs = json.orgs.filter((o: any) => o.parent_org_id === orgId)
        const tx = json.transactions.filter((t: any) => t.org_id === orgId)
        const members = json.members.filter((m: any) => m.org_id === orgId)

        // Roll‑ups
        const subRoutingTotal = subs.reduce(
          (sum: number, s: any) => sum + (s.routing_pool || 0),
          0
        )
        const routingPoolTotal = (org.routing_pool || 0) + subRoutingTotal

        const subTxTotal = subs.reduce(
          (sum: number, s: any) => sum + (s.tx_count || 0),
          0
        )
        const txTotal = (org.tx_count || 0) + subTxTotal

        const avgTx = txTotal > 0 ? routingPoolTotal / txTotal : 0

        setData({
          org,
          subs,
          tx,
          members,
          routingPoolTotal,
          txTotal,
          avgTx,
        })
      })
  }, [orgId])

  if (!data) return <div className="p-6">Loading...</div>

  const { org, subs, tx, members, routingPoolTotal, txTotal, avgTx } = data

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">{org.name}</h1>

      {/* ============================
          ORG SUMMARY
      ============================ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Routing Pool</h2>
          <p className="text-3xl font-bold mt-2">
            ${routingPoolTotal.toFixed(2)}
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-3xl font-bold mt-2">{txTotal}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Avg Tx</h2>
          <p className="text-3xl font-bold mt-2">{avgTx.toFixed(2)}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Members</h2>
          <p className="text-3xl font-bold mt-2">{members.length}</p>
        </div>
      </div>

      {/* ============================
          SUB‑ORGS
      ============================ */}
      {subs.length > 0 && (
        <div className="bg-white rounded-xl shadow border p-6">
          <h2 className="text-xl font-semibold mb-4">Sub‑Organizations</h2>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Routing Pool</th>
                <th className="px-4 py-2 text-left">Members</th>
                <th className="px-4 py-2 text-left">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub: any) => (
                <tr key={sub.id} className="border-b">
                  <td className="px-4 py-2">{sub.name}</td>
                  <td className="px-4 py-2">${sub.routing_pool}</td>
                  <td className="px-4 py-2">{sub.member_count}</td>
                  <td className="px-4 py-2">{sub.tx_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================
          MEMBERS
      ============================ */}
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Members</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m: any) => (
              <tr key={m.id} className="border-b">
                <td className="px-4 py-2">{m.name}</td>
                <td className="px-4 py-2">{m.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================
          TRANSACTIONS
      ============================ */}
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Routing</th>
              <th className="px-4 py-2 text-left">BLVE Fee</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {tx.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="px-4 py-2">${t.amount}</td>
                <td className="px-4 py-2">${t.routing_amount}</td>
                <td className="px-4 py-2">${t.blve_fee}</td>
                <td className="px-4 py-2">
                  {new Date(t.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
