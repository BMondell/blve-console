'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Suspense } from 'react'

// Optional: define the expected shape of the data (helps catch bugs later)
interface DashboardData {
  name: string
  slug: string
  routing_pool: string
  sub_orgs: Array<{
    id?: string
    slug: string
    name: string
    routing_pool: string
  }>
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const orgSlug = searchParams.get('org')?.toLowerCase().trim().replace(/\.$/, '') || 'fiu'

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔄 Loading dashboard for org:', orgSlug)
    setLoading(true)
    setError(null)

    fetch(`/api/org-dashboard?slug=${encodeURIComponent(orgSlug)}`)
      .then(async (res) => {
        console.log('📡 API response status:', res.status)
        if (!res.ok) {
          const text = await res.text()
          console.error('❌ API error response:', text.substring(0, 200))
          throw new Error(`API error ${res.status}`)
        }
        return res.json()
      })
      .then((result) => {
        console.log('✅ API success - result:', result)
        if (result.success && result.data) {
          setData(result.data)
          console.log('💾 Dashboard data loaded:', result.data.name)
        } else {
          throw new Error(result.error || 'No data in response')
        }
      })
      .catch((err) => {
        console.error('💥 Dashboard load failed:', err)
        setError(err.message || 'Unknown error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orgSlug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-xl text-gray-700">Loading {orgSlug.toUpperCase()} dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-800 mb-2">Error Loading Dashboard</h1>
        <p className="text-red-700 mb-4 max-w-md break-words">{error}</p>
        <p className="text-sm text-gray-600 mb-4">
          Org: <code className="bg-gray-200 px-2 py-1 rounded">{orgSlug}</code>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-yellow-800 mb-4">No Data Received</h1>
          <p className="text-yellow-700 text-lg">API returned success but no data payload</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white">
          <h1 className="text-4xl font-extrabold">{data.name} Dashboard</h1>
          <p className="text-blue-100 mt-2">Slug: {data.slug}</p>
        </div>

        {/* Main content */}
        <div className="p-8">
          {/* Routing Pool Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center mb-10 shadow-inner">
            <p className="text-lg text-gray-600 mb-3 uppercase tracking-wide">Total Routing Pool</p>
            <p className="text-6xl font-black text-blue-700">
              ${parseFloat(data.routing_pool).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Sub-organizations */}
          {data.sub_orgs && data.sub_orgs.length > 0 ? (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sub-organizations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.sub_orgs.map((sub: any) => (
                  <div
                    key={sub.id || sub.slug}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{sub.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">Slug: {sub.slug}</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${parseFloat(sub.routing_pool || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-xl text-gray-600">No sub-organizations configured for {data.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Page wrapper with Suspense (fixes prerender error)
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">⏳ Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
Merge branch 'main' of https://github.com/BMondell/blve-console

Re-integrated local dashboard fixes (Suspense + useSearchParams) after pulling remote changes