"use client"

import { useEffect, useState } from "react"

export default function MembersPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/org-dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
  }, [])

  if (!data) return <div className="p-6">Loading...</div>

  const members = data.members || []
  const orgs = data.orgs || []

  const orgMap = Object.fromEntries(orgs.map((o: any) => [o.id, o]))

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Members</h1>

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Sub‑Org</th>
              <th className="px-4 py-2">Parent Org</th>
              <th className="px-4 py-2">Joined</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m: any) => {
              const subOrg = orgMap[m.org_id]
              const parentOrg = subOrg ? orgMap[subOrg.parent_org_id] : null

              return (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{m.name}</td>
                  <td className="px-4 py-2">{m.email}</td>
                  <td className="px-4 py-2">{subOrg?.name || "—"}</td>
                  <td className="px-4 py-2">{parentOrg?.name || "—"}</td>
                  <td className="px-4 py-2">
                    {new Date(m.created_at).toLocaleDateString()}
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
