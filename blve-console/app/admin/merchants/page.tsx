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
  Store,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  History,
} from "lucide-react";

type Merchant = {
  id: string;
  name: string;
  txCount: number;
  volume: number;
  routing: number;
};

type Transaction = {
  id: string;
  merchant_id: string;
  amount: number;
  routing_amount: number;
  timestamp: string;
};

type OrgDashboardResponse = {
  merchants?: any[];
  transactions?: Transaction[];
  error?: string;
};

export default function MerchantsListPage() {
  const [data, setData] = useState<OrgDashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard");
        const json = (await res.json()) as OrgDashboardResponse;

        if (!res.ok) {
          setError(json.error || "Failed to load merchant data.");
          return;
        }

        setData(json);
      } catch (e) {
        console.error(e);
        setError("Failed to load merchant data.");
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
      <BLVPageContainer title="Merchants">
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
      <BLVPageContainer title="Merchants">
        <BLVCard>
          <p className="text-gray-600">Loading merchants…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const merchants = data.merchants || [];
  const transactions = data.transactions || [];

  const totalVolume = transactions.reduce(
    (sum: number, t: any) => sum + (t.amount || 0),
    0
  );

  const totalRouting = transactions.reduce(
    (sum: number, t: any) => sum + (t.routing_amount || 0),
    0
  );

  // Process merchants with their stats
  const processedMerchants: Merchant[] = merchants.map((m) => {
    const tx = transactions.filter((t: any) => t.merchant_id === m.id);
    const volume = tx.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const routing = tx.reduce((sum: number, t: any) => sum + (t.routing_amount || 0), 0);

    return {
      ...m,
      txCount: tx.length,
      volume,
      routing,
    };
  });

  // ─────────────────────────────────────────────────────────────────
  // TOTALS ROW METRICS
  // ─────────────────────────────────────────────────────────────────
  const totalsMetrics = [
    {
      label: "Total Merchants",
      value: merchants.length,
      icon: <Store size={24} />,
    },
    {
      label: "Total Volume",
      value: `$${totalVolume.toLocaleString("en-US", {
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
  ];

  return (
    <BLVPageContainer 
      title="Merchants" 
      subtitle="Monitor merchant activity and transaction routing"
    >
      {/* TOTALS ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      {/* SEPARATION LINE */}
      <BLVSeparationLine />

      {/* MERCHANTS LIST */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Active Merchants"
          subtitle={`${merchants.length} merchant${merchants.length !== 1 ? "s" : ""} active`}
          icon={<Store size={20} />}
        />
        
        {processedMerchants.length === 0 ? (
          <BLVCard>
            <p className="text-gray-600">No merchants found.</p>
          </BLVCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {processedMerchants.map((merchant) => (
              <Link key={merchant.id} href={`/merchant/${merchant.id}`}>
                <BLVCard className="hover:border-gray-300 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                        <Store size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                          {merchant.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                          {merchant.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-12">
                      <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ${merchant.volume.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 font-medium uppercase">Volume</p>
                      </div>
                      
                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-gray-900">
                          ${merchant.routing.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 font-medium uppercase">Routing</p>
                      </div>
                      
                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {merchant.txCount}
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

      {/* TRANSACTION HISTORY */}
      <div className="space-y-6">
        <BLVSectionHeader
          title="Recent Merchant Transactions"
          subtitle="Latest activity across all merchants"
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Merchant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Routing</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((t) => {
                    const merchant = merchants.find((m: any) => m.id === t.merchant_id);
                    const date = new Date(t.timestamp);
                    const formatted_timestamp = date.toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {merchant ? merchant.name : "Unknown Merchant"}
                        </td>
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
