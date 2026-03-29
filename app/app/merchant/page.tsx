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
import {
  Store,
  TrendingUp,
  ArrowRight,
  History,
  CreditCard,
} from "lucide-react";

type Transaction = {
  id: string;
  merchant_id: string;
  amount: number;
  routing_amount: number;
  timestamp: string;
};

type MerchantDashboardResponse = {
  merchants?: any[];
  transactions?: Transaction[];
  error?: string;
};

export default function MerchantDashboard() {
  const [data, setData] = useState<MerchantDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard");
        const json = (await res.json()) as MerchantDashboardResponse;

        if (!res.ok) {
          setError(json.error || "Failed to load dashboard data.");
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
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <BLVPageContainer title="Merchant Dashboard">
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
      <BLVPageContainer title="Merchant Dashboard">
        <BLVCard>
          <p className="text-gray-600">Loading dashboard…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const transactions = data.transactions || [];
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalRouting = transactions.reduce((sum, t) => sum + t.routing_amount, 0);

  // ─────────────────────────────────────────────────────────────────
  // TOTALS ROW METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalsMetrics = [
    {
      label: "Total Volume",
      value: `$${totalVolume.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Routing Generated",
      value: `$${totalRouting.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <ArrowRight size={24} />,
    },
    {
      label: "Total Transactions",
      value: transactions.length,
      icon: <History size={24} />,
    },
  ];

  return (
    <BLVPageContainer 
      title="Merchant Dashboard" 
      subtitle="Overview of your transaction activity and routing impact"
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      {/* SEPARATION LINE */}
      <BLVSeparationLine />

      {/* RECENT ACTIVITY */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Recent Transactions"
          subtitle="Your latest customer activity"
          icon={<CreditCard size={20} />}
        />
        
        {transactions.length === 0 ? (
          <BLVCard>
            <p className="text-gray-600">No transactions recorded yet.</p>
          </BLVCard>
        ) : (
          <BLVCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Routing</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.slice(0, 10).map((t) => {
                    const date = new Date(t.timestamp);
                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          ${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${t.routing_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            Completed
                          </span>
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
