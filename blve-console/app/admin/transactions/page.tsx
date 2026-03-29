"use client";

import { useEffect, useState } from "react";
import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
} from "@/components/blve";
import {
  ArrowRight,
  TrendingUp,
  CreditCard,
  History,
  Hash,
  Percent,
} from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  routing_amount: number;
  blve_fee: number;
  offer_percentage: number;
  mcc_code: string;
  external_tx_id: string;
  timestamp: string;
};

type OrgDashboardResponse = {
  transactions?: Transaction[];
  error?: string;
};

export default function TransactionsListPage() {
  const [data, setData] = useState<OrgDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard");
        const json = (await res.json()) as OrgDashboardResponse;

        if (!res.ok) {
          setError(json.error || "Failed to load transactions.");
          return;
        }

        setData(json);
      } catch (e) {
        console.error(e);
        setError("Failed to load transactions.");
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
      <BLVPageContainer title="Transactions">
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
      <BLVPageContainer title="Transactions">
        <BLVCard>
          <p className="text-gray-600">Loading transactions…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const transactions = data.transactions || [];

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalRouting = transactions.reduce((sum, t) => sum + t.routing_amount, 0);
  const totalFees = transactions.reduce((sum, t) => sum + t.blve_fee, 0);

  // ─────────────────────────────────────────────────────────────────
  // TOTALS ROW METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalsMetrics = [
    {
      label: "Total Transactions",
      value: transactions.length,
      icon: <History size={24} />,
    },
    {
      label: "Total Volume",
      value: `$${totalAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={24} />,
    },
    {
      label: "Total Routing",
      value: `$${totalRouting.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <ArrowRight size={24} />,
    },
    {
      label: "Total BLVE Fees",
      value: `$${totalFees.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <CreditCard size={24} />,
    },
  ];

  return (
    <BLVPageContainer 
      title="Transactions" 
      subtitle="Complete history of all transactions in the BLVΞ network"
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      {/* SEPARATION LINE */}
      <BLVSeparationLine />

      {/* TRANSACTIONS LIST */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Transaction History"
          subtitle={`${transactions.length} transaction${transactions.length !== 1 ? "s" : ""} recorded`}
          icon={<History size={20} />}
        />
        
        {transactions.length === 0 ? (
          <BLVCard>
            <p className="text-gray-600">No transactions found.</p>
          </BLVCard>
        ) : (
          <BLVCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Routing</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">BLVE Fee</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Offer %</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">MCC</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">External ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => {
                    const date = new Date(t.timestamp);
                    const formatted_timestamp = date.toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatted_timestamp}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          ${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${t.routing_amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${t.blve_fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Percent size={12} className="text-gray-400" />
                            {t.offer_percentage}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Hash size={12} className="text-gray-400" />
                            {t.mcc_code}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                          {t.external_tx_id}
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
