"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
  BLVMetric,
} from "@/components/blve";
import {
  User,
  TrendingUp,
  ArrowRight,
  History,
  Building2,
  Zap,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

type Transaction = {
  id: string;
  member_id: string;
  amount: number;
  routing_amount: number;
  timestamp: string;
};

type Member = {
  id: string;
  name: string;
  email: string;
  org_id: string;
};

type Org = {
  id: string;
  name: string;
};

type OrgDashboardResponse = {
  orgs?: Org[];
  members?: Member[];
  transactions?: Transaction[];
  user?: { id: string };
  error?: string;
};

export default function MemberDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<OrgDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard");
        const json = (await res.json()) as OrgDashboardResponse;

        if (!res.ok) {
          setError(json.error || "Failed to load dashboard data.");
          return;
        }

        if (!json.user) {
          router.push("/login");
          return;
        }

        setData(json);
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  // ─────────────────────────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <BLVPageContainer title="Member Dashboard">
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
      <BLVPageContainer title="Member Dashboard">
        <BLVCard className="p-12 flex flex-col items-center justify-center space-y-4">
          <RefreshCw size={40} className="text-gray-300 animate-spin" />
          <p className="text-gray-500 font-medium">Loading your dashboard…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const currentUserId = data.user?.id;
  const member = data.members?.find((m) => m.id === currentUserId);
  const org = data.orgs?.find((o) => o.id === member?.org_id);
  const memberTx = data.transactions?.filter((t) => t.member_id === currentUserId) || [];

  const totalRouting = memberTx.reduce((sum, t) => sum + (t.routing_amount || 0), 0);
  const totalAmount = memberTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgRouting = memberTx.length > 0 ? totalRouting / memberTx.length : 0;

  // ─────────────────────────────────────────────────────────────────
  // TOTALS ROW METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalsMetrics = [
    {
      label: "Your Routing",
      value: `$${totalRouting.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Total Transactions",
      value: memberTx.length,
      icon: <ArrowRight size={24} />,
    },
    {
      label: "Avg Routing / Tx",
      value: `$${avgRouting.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <Zap size={24} />,
    },
  ];

  return (
    <BLVPageContainer 
      title={`Welcome, ${member?.name || "Member"}`} 
      subtitle="Your personal BLVΞ network activity and performance"
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      {/* SEPARATION LINE */}
      <BLVSeparationLine />

      {/* MEMBER INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BLVCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-gray-900 font-medium">{member?.name}</span>
            </div>
            {org && (
              <div className="flex items-center gap-3">
                <Building2 size={18} className="text-gray-400" />
                <span className="text-gray-900 font-medium">{org.name}</span>
              </div>
            )}
          </div>
        </BLVCard>
        
        <div className="flex flex-col justify-center">
          <BLVCard className="p-6 bg-black text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Current Status</p>
                <h3 className="text-xl font-black mt-1">ACTIVE MEMBER</h3>
              </div>
              <Zap size={32} className="text-white" />
            </div>
          </BLVCard>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Recent Activity"
          subtitle="Your latest routing transactions"
          icon={<History size={20} />}
        />
        
        {memberTx.length === 0 ? (
          <BLVCard className="p-12 text-center">
            <p className="text-gray-500 font-medium">No activity recorded yet.</p>
          </BLVCard>
        ) : (
          <BLVCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Routing</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {memberTx.slice(0, 10).map((t) => {
                    const date = new Date(t.timestamp);
                    const formatted_timestamp = date.toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          ${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${t.routing_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatted_timestamp}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </BLVCard>
        )}
      </div>
    </BLVPageContainer>
  );
}
