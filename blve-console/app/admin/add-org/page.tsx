"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
  BLVMetric,
} from "@/components/blve";
import { Building2, TrendingUp, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";

interface DashboardData {
  name: string;
  slug: string;
  routing_pool: string;
  sub_orgs: Array<{
    id?: string;
    slug: string;
    name: string;
    routing_pool: string;
  }>;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const orgSlug = searchParams.get("org")?.toLowerCase().trim().replace(/\.$/, "") || "fiu";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/org-dashboard?slug=${encodeURIComponent(orgSlug)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        if (result.success && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.error || "No data in response");
        }
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orgSlug]);

  if (loading) {
    return (
      <BLVPageContainer title="Organization Dashboard">
        <BLVCard className="p-12 flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={40} className="text-gray-300 animate-spin" />
          <p className="text-gray-500 font-medium">Loading {orgSlug.toUpperCase()} dashboard…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  if (error) {
    return (
      <BLVPageContainer title="Organization Dashboard">
        <BLVCard className="p-12 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Error Loading Dashboard</h2>
            <p className="text-gray-500 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-bold"
          >
            Refresh Page
          </button>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  if (!data) {
    return (
      <BLVPageContainer title="Organization Dashboard">
        <BLVCard className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900">No Data Received</h2>
          <p className="text-gray-500 mt-2">API returned success but no data payload.</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const totalsMetrics = [
    {
      label: "Total Routing Pool",
      value: `$${parseFloat(data.routing_pool).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Sub-Organizations",
      value: data.sub_orgs?.length || 0,
      icon: <Building2 size={24} />,
    },
  ];

  return (
    <BLVPageContainer 
      title={`${data.name} Dashboard`} 
      subtitle={`Detailed overview for organization: ${data.slug}`}
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      <BLVSeparationLine />

      {/* SUB-ORGANIZATIONS */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Sub-Organizations"
          subtitle={`${data.sub_orgs?.length || 0} sub-organizations configured`}
          icon={<Building2 size={20} />}
        />
        
        {data.sub_orgs && data.sub_orgs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.sub_orgs.map((sub: any) => (
              <BLVCard key={sub.id || sub.slug} className="p-6 space-y-4 hover:border-gray-300 transition-all duration-200 group">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <Building2 size={20} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Slug</p>
                    <p className="text-sm font-bold text-gray-900">{sub.slug}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">{sub.name}</h3>
                  <BLVMetric
                    label="Routing Pool"
                    value={`$${parseFloat(sub.routing_pool || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
                    size="md"
                  />
                </div>
              </BLVCard>
            ))}
          </div>
        ) : (
          <BLVCard className="p-12 text-center">
            <p className="text-gray-500 font-medium">No sub-organizations configured for {data.name}.</p>
          </BLVCard>
        )}
      </div>
    </BLVPageContainer>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <BLVPageContainer title="Organization Dashboard">
          <BLVCard className="p-12 flex flex-col items-center justify-center space-y-4">
            <RefreshCw size={40} className="text-gray-300 animate-spin" />
            <p className="text-gray-500 font-medium">Initializing dashboard…</p>
          </BLVCard>
        </BLVPageContainer>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
