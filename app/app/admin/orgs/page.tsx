"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
  BLVMetric,
} from "@/components/blve";
import {
  Building2,
  Users,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Plus,
} from "lucide-react";

type Org = {
  id: string;
  name: string;
  slug: string;
  org_type: string;
  routing_pool: string | number;
  sub_org_count: number;
  member_count: number;
  tx_count: number;
  tx_avg: number;
};

type Summary = {
  total_pool: number;
  total_orgs: number;
  total_members: number;
  total_tx: number;
  avg_tx: number;
};

type AdminOverviewResponse = {
  success: boolean;
  orgs: Org[];
  summary: Summary;
  error?: string;
};

export default function OrgsListPage() {
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/overview");
        const json = (await res.json()) as AdminOverviewResponse;

        if (!res.ok || !json.success) {
          setError(json.error || "Failed to load organizations.");
          return;
        }

        setData(json);
      } catch (e) {
        console.error(e);
        setError("Failed to load organizations.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <BLVPageContainer title="Organizations">
        <BLVCard>
          <p className="text-red-700 font-medium">{error}</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────────────────────────
  if (loading || !data) {
    return (
      <BLVPageContainer title="Organizations">
        <BLVCard>
          <p className="text-gray-600">Loading organizations…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const { orgs, summary } = data;

  // ─────────────────────────────────────────────────────────────────
  // TOTALS ROW METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalsMetrics = [
    {
      label: "Total Organizations",
      value: summary.total_orgs,
      icon: <Building2 size={24} />,
    },
    {
      label: "Total Routing Pool",
      value: `$${summary.total_pool.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Total Members",
      value: summary.total_members.toLocaleString(),
      icon: <Users size={24} />,
    },
    {
      label: "Total Transactions",
      value: summary.total_tx.toLocaleString(),
      icon: <ArrowRight size={24} />,
    },
  ];

  return (
    <BLVPageContainer 
      title="Organizations" 
      subtitle="Manage and monitor all organizations in the BLVΞ network"
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      {/* SEPARATION LINE */}
      <BLVSeparationLine />

      {/* ACTIONS */}
      <div className="flex justify-end">
        <Link
          href="/admin/add-org"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
        >
          <Plus size={18} />
          Add Organization
        </Link>
      </div>

      {/* ORGANIZATIONS LIST */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="All Organizations"
          subtitle={`${orgs.length} organization${orgs.length !== 1 ? "s" : ""} active`}
          icon={<Building2 size={20} />}
        />
        
        {orgs.length === 0 ? (
          <BLVCard>
            <p className="text-gray-600">No organizations found.</p>
          </BLVCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orgs.map((org) => (
              <Link key={org.id} href={`/admin/orgs/${org.id}`}>
                <BLVCard className="hover:border-gray-300 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                          {org.org_type || "Organization"} • {org.slug}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ${Number(org.routing_pool).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 font-medium uppercase">Routing Pool</p>
                      </div>
                      
                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {org.member_count}
                        </p>
                        <p className="text-xs text-gray-500 font-medium uppercase">Members</p>
                      </div>
                      
                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {org.tx_count}
                        </p>
                        <p className="text-xs text-gray-500 font-medium uppercase">Transactions</p>
                      </div>
                      
                      <div className="text-gray-300 group-hover:text-gray-900 transition-colors">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </BLVCard>
              </Link>
            ))}
          </div>
        )}
      </div>
    </BLVPageContainer>
  );
}
