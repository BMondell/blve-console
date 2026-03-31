"use client";

import { useEffect, useState } from "react";
import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
  BLVMetric,
} from "@/components/blve";
import { Building2, Users, CreditCard, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || "Failed to load overview");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <BLVPageContainer title="Admin Dashboard" subtitle="Comprehensive overview of the BLVΞ network performance">
        <div className="flex items-center justify-center py-blv-2xl">
          <RefreshCw className="animate-spin text-blv-accent" size={40} />
        </div>
      </BLVPageContainer>
    );
  }

  if (error) {
    return (
      <BLVPageContainer title="Admin Dashboard" subtitle="Comprehensive overview of the BLVΞ network performance">
        <BLVCard>
          <div className="flex items-center gap-blv-lg text-red-400">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const summary = data?.summary || {};
  const metrics = [
    { label: "Total Pool", value: `$${(summary.total_pool || 0).toLocaleString()}`, icon: <TrendingUp size={24} /> },
    { label: "Total Routed", value: `$${(summary.total_routed || 0).toLocaleString()}`, icon: <CreditCard size={24} /> },
    { label: "Organizations", value: summary.total_orgs || 0, icon: <Building2 size={24} /> },
    { label: "Members", value: summary.total_members || 0, icon: <Users size={24} /> },
  ];

  return (
    <BLVPageContainer title="Admin Dashboard" subtitle="Comprehensive overview of the BLVΞ network performance">
      {/* Totals Row */}
      <BLVTotalsRow metrics={metrics} />
      
      <BLVSeparationLine />

      {/* Organization Performance */}
      <div className="space-y-blv-lg">
        <BLVSectionHeader 
          title="Organization Performance" 
          subtitle="Health and activity metrics for each organization"
          icon={<Building2 size={20} />} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-blv-lg">
          {data?.orgs?.map((org: any) => (
            <BLVCard key={org.id} hoverable>
              <div className="space-y-blv-lg">
                <div>
                  <h3 className="text-blv-lg font-bold text-blv-text">{org.name}</h3>
                  <p className="text-blv-xs text-blv-text-tertiary font-mono mt-blv-sm">{org.slug}</p>
                </div>
                <div className="grid grid-cols-2 gap-blv-md">
                  <BLVMetric label="Members" value={org.member_count || 0} size="sm" />
                  <BLVMetric label="Routed" value={`$${(org.routed_sum || 0).toLocaleString()}`} size="sm" />
                </div>
              </div>
            </BLVCard>
          ))}
        </div>
      </div>

      <BLVSeparationLine />

      {/* Transaction Activity */}
      <div className="space-y-blv-lg">
        <BLVSectionHeader 
          title="Transaction Activity" 
          subtitle="Real-time transaction volume and routing metrics"
          icon={<TrendingUp size={20} />} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-blv-lg">
          <BLVCard>
            <BLVMetric 
              label="Total Transactions" 
              value={summary.total_tx || 0} 
              size="lg"
            />
          </BLVCard>
          <BLVCard>
            <BLVMetric 
              label="Avg Routing %" 
              value={`${(summary.avg_routing_percentage || 0).toFixed(2)}%`} 
              size="lg"
            />
          </BLVCard>
        </div>
      </div>
    </BLVPageContainer>
  );
}
