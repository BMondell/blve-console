"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
  BLVTwoColumn,
  BLVMetric,
} from "@/components/blve";
import { Building2, Users, TrendingUp, DollarSign, ArrowRight, ChevronRight } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (error) {
    return (
      <BLVPageContainer title="Admin Dashboard">
        <BLVCard>
          <p className="text-red-700 font-medium">{error}</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  if (loading || !data) {
    return (
      <BLVPageContainer title="Admin Dashboard">
        <BLVCard>
          <p className="text-gray-600">Loading dashboard data…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // DATA EXTRACTION
  // ─────────────────────────────────────────────────────────────────
  const orgs = data.orgs || [];
  const members = data.members || [];
  const transactions = data.transactions || [];

  const parentOrgs = orgs.filter((o: any) => o.parent_org_id === null);

  // ─────────────────────────────────────────────────────────────────
  // TOTALS CALCULATION
  // ─────────────────────────────────────────────────────────────────
  let totalRouting = 0;
  let totalMembers = 0;
  let totalTransactions = 0;

  parentOrgs.forEach((org: any) => {
    const suborgIds = orgs
      .filter((o: any) => o.parent_org_id === org.id)
      .map((o: any) => o.id);

    const orgMembers = members.filter(
      (m: any) => m.org_id === org.id || suborgIds.includes(m.org_id)
    );

    const orgTx = transactions.filter(
      (t: any) => t.org_id === org.id || suborgIds.includes(t.org_id)
    );

    totalRouting += Number(org.routing_pool);
    totalMembers += orgMembers.length;
    totalTransactions += orgTx.length;
  });

  const totalOrgs = parentOrgs.length;

  // ─────────────────────────────────────────────────────────────────
  // TOTALS ROW METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalsMetrics = [
    {
      label: "Total Organizations",
      value: totalOrgs,
      icon: <Building2 size={24} />,
    },
    {
      label: "Routing Pool",
      value: `$${totalRouting.toLocaleString()}`,
      icon: <DollarSign size={24} />,
    },
    {
      label: "Total Members",
      value: totalMembers.toLocaleString(),
      icon: <Users size={24} />,
    },
    {
      label: "Transactions",
      value: totalTransactions.toLocaleString(),
      icon: <TrendingUp size={24} />,
    },
  ];

  return (
    <BLVPageContainer 
      title="Admin Dashboard" 
      subtitle="Comprehensive overview of the BLVΞ network performance"
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      {/* SEPARATION LINE */}
      <BLVSeparationLine />

      {/* PERFORMANCE OVERVIEW */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Performance Overview"
          subtitle="Network health and activity metrics"
          icon={<TrendingUp size={20} />}
        />
        <BLVTwoColumn
          leftTitle="Organization Health"
          rightTitle="Transaction Activity"
          leftContent={
            <div className="space-y-6">
              <BLVMetric
                label="Active Organizations"
                value={totalOrgs}
                size="lg"
              />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider">Members Per Org</span>
                  <span className="text-gray-900 font-bold">
                    {totalOrgs > 0 ? (totalMembers / totalOrgs).toFixed(1) : "—"}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{
                      width: totalOrgs > 0 ? `${Math.min((totalMembers / (totalOrgs * 20)) * 100, 100)}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          }
          rightContent={
            <div className="space-y-6">
              <BLVMetric
                label="Total Transactions"
                value={totalTransactions.toLocaleString()}
                size="lg"
              />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium uppercase tracking-wider">Avg Routing Pool</span>
                  <span className="text-gray-900 font-bold">
                    ${(totalRouting / Math.max(totalOrgs, 1)).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* ORGANIZATIONS LIST */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Top Organizations"
          subtitle="Recent activity by organization"
          icon={<Building2 size={20} />}
        />
        <BLVCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Routing Pool</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Members</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transactions</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parentOrgs.slice(0, 5).map((org: any) => {
                  const suborgIds = orgs
                    .filter((o: any) => o.parent_org_id === org.id)
                    .map((o: any) => o.id);

                  const orgMembers = members.filter(
                    (m: any) => m.org_id === org.id || suborgIds.includes(m.org_id)
                  );

                  const orgTx = transactions.filter(
                    (t: any) => t.org_id === org.id || suborgIds.includes(t.org_id)
                  );

                  return (
                    <tr key={org.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {org.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ${Number(org.routing_pool).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {orgMembers.length.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {orgTx.length.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orgs/${org.id}`}
                          className="inline-flex items-center gap-1 text-sm font-bold text-gray-400 group-hover:text-black transition-colors"
                        >
                          View <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {parentOrgs.length > 5 && (
            <div className="p-4 border-t border-gray-100 text-center">
              <Link 
                href="/admin/orgs" 
                className="text-sm font-bold text-gray-500 hover:text-black transition-colors inline-flex items-center gap-2"
              >
                View All Organizations <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </BLVCard>
      </div>
    </BLVPageContainer>
  );
}
