"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  BLVPageContainer,
  BLVTotalsRow,
  BLVSeparationLine,
  BLVSectionHeader,
  BLVCard,
  BLVTwoColumn,
  BLVMetric,
  BLVSparkline,
} from "@/components/blve";

import {
  User,
  Activity,
  TrendingUp,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  name?: string;
  created_at: string;
  org_id?: string;
}

interface Organization {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  amount: number;
  routing_amount: number;
  timestamp: string;
  member_id: string;
}

interface OrgDashboardResponse {
  members?: Member[];
  orgs?: Organization[];
  transactions?: Transaction[];
  error?: string;
}

const SPARK_TX = [1, 2, 3, 4, 3, 5, 6, 7, 6, 8];
const SPARK_ROUTING = [5, 8, 10, 12, 11, 15, 14, 18, 17, 20];
const SPARK_VOLUME = [20, 25, 22, 30, 28, 35, 33, 40, 38, 45];

export default function AdminMemberDetailPage() {
  const params = useParams() as { id: string };
  const memberId = params.id;

  const [member, setMember] = useState<Member | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/org-dashboard");
        const json = (await res.json()) as OrgDashboardResponse;

        const members = json.members || [];
        const orgs = json.orgs || [];
        const txs = json.transactions || [];

        const m = members.find((mm: any) => mm.id === memberId);
        if (!m) {
          setError("Member not found");
          return;
        }

        const o = orgs.find((oo: any) => oo.id === m.org_id) || null;
        const memberTx = txs.filter((t: any) => t.member_id === memberId);

        setMember(m);
        setOrg(o);
        setTransactions(memberTx);
      } catch (e) {
        console.error(e);
        setError("Failed to load member");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [memberId]);

  if (error) {
    return (
      <BLVPageContainer title="Member Details">
        <BLVCard>
          <p className="text-[#F87171] font-medium">{error}</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  if (loading || !member) {
    return (
      <BLVPageContainer title="Member Details">
        <BLVCard>
          <p className="text-[rgba(255,255,255,0.60)]">Loading member data…</p>
        </BLVCard>
      </BLVPageContainer>
    );
  }

  const totalTransactionAmount = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const totalRoutingAmount = transactions.reduce(
    (sum, t) => sum + (t.routing_amount || 0),
    0
  );
  const totalTransactions = transactions.length;
  const averageTransactionAmount =
    totalTransactions > 0 ? totalTransactionAmount / totalTransactions : 0;

  const memberName =
    member.name ||
    `${member.first_name || ""} ${member.last_name || ""}`.trim();

  const joinDate = new Date(member.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalsMetrics = [
    {
      label: "Total Transactions",
      value: totalTransactions,
      icon: <Activity size={24} />,
      trend: { value: 0, direction: "up" as const },
      sparkline: <BLVSparkline data={SPARK_TX} color="#A78BFA" />,
    },
    {
      label: "Total Volume",
      value: `$${totalTransactionAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <TrendingUp size={24} />,
      trend: { value: 0, direction: "up" as const },
      sparkline: <BLVSparkline data={SPARK_VOLUME} color="#3B82F6" />,
    },
    {
      label: "Routing Contributed",
      value: `$${totalRoutingAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <ArrowRight size={24} />,
      trend: { value: 0, direction: "up" as const },
      sparkline: <BLVSparkline data={SPARK_ROUTING} color="#4ADE80" />,
    },
    {
      label: "Member Status",
      value: "Active",
      icon: <User size={24} />,
      trend: { value: 0, direction: "up" as const },
    },
  ];

  return (
    <BLVPageContainer
      title={memberName}
      subtitle="Member profile and activity overview"
    >
      {/* MEMBER PROFILE CARD */}
      <BLVCard>
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-[#0B0E11] rounded-xl flex items-center justify-center text-[rgba(255,255,255,0.35)]">
            <User size={28} />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">{memberName}</h3>

            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {member.email && (
                <p className="text-xs text-[rgba(255,255,255,0.35)] font-medium">
                  {member.email}
                </p>
              )}

              <span className="text-[rgba(255,255,255,0.20)]">·</span>

              <div className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.35)] font-medium">
                <Calendar size={12} />
                Joined {joinDate}
              </div>

              <span className="text-[rgba(255,255,255,0.20)]">·</span>

              <p className="text-xs text-[rgba(255,255,255,0.35)] font-mono">
                ID: {member.id}
              </p>
            </div>
          </div>

          {org && (
            <div className="text-right hidden md:block">
              <Link
                href={`/admin/orgs/${org.id}`}
                className="text-[#3B82F6] hover:text-[#2563EB] font-semibold transition-colors"
              >
                {org.name}
              </Link>
              <p className="text-xs text-[rgba(255,255,255,0.35)] uppercase tracking-wider">
                Organization
              </p>
            </div>
          )}
        </div>
      </BLVCard>

      {/* KPI ROW */}
      <BLVTotalsRow metrics={totalsMetrics} />

      <BLVSeparationLine />

      {/* ACTIVITY OVERVIEW */}
      <BLVSectionHeader
        title="Activity Overview"
        subtitle="Transaction and routing metrics"
        icon={<Activity size={20} />}
      />

      <BLVTwoColumn
        leftTitle="Transaction Metrics"
        rightTitle="Routing Impact"
        leftContent={
          <div className="space-y-4">
            <BLVMetric label="Total Transactions" value={totalTransactions} size="lg" />
            <BLVMetric
              label="Average Transaction Amount"
              value={`$${averageTransactionAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              size="md"
            />
            <BLVMetric
              label="Total Volume"
              value={`$${totalTransactionAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              size="md"
            />
          </div>
        }
        rightContent={
          <div className="space-y-4">
            <BLVMetric
              label="Total Routing Contributed"
              value={`$${totalRoutingAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              size="lg"
            />
            <BLVMetric
              label="Average Routing Per Transaction"
              value={
                totalTransactions > 0
                  ? `$${(totalRoutingAmount / totalTransactions).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "—"
              }
              size="md"
            />
            <BLVMetric
              label="Routing as % of Volume"
              value={
                totalTransactionAmount > 0
                  ? `${((totalRoutingAmount / totalTransactionAmount) * 100).toFixed(2)}%`
                  : "—"
              }
              size="md"
            />
          </div>
        }
      />

      <BLVSeparationLine />

      {/* TRANSACTION HISTORY — CARD-BASED, NO TABLES */}
      <BLVSectionHeader
        title="Transaction History"
        subtitle={`${totalTransactions} transaction${totalTransactions !== 1 ? "s" : ""}`}
        icon={<ArrowRight size={20} />}
      />

      {totalTransactions === 0 ? (
        <BLVCard>
          <p className="text-[rgba(255,255,255,0.60)]">No transactions yet.</p>
        </BLVCard>
      ) : (
        <BLVTwoColumn>
          {transactions.map((tx) => {
            const routingPercent =
              tx.amount > 0
                ? ((tx.routing_amount / tx.amount) * 100).toFixed(2)
                : "0.00";

            return (
              <BLVCard key={tx.id} hoverable>
                <BLVMetric
                  label="Amount"
                  value={`$${tx.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  size="lg"
                />

                <BLVMetric
                  label="Routing Amount"
                  value={`$${tx.routing_amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  size="md"
                />

                <BLVMetric label="Routing %" value={`${routingPercent}%`} size="md" />

                <p className="text-xs text-[rgba(255,255,255,0.35)] font-mono mt-2">
                  {new Date(tx.timestamp).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </BLVCard>
            );
          })}
        </BLVTwoColumn>
      )}

      <BLVSeparationLine />

      {/* ACTIVITY SUMMARY */}
      {totalTransactions > 0 && (
        <>
          <BLVSectionHeader
            title="Activity Summary"
            subtitle="Key performance indicators"
            icon={<TrendingUp size={20} />}
          />

          <BLVTwoColumn>
            <BLVCard>
              <BLVMetric
                label="Transactions Per Day"
                value={
                  totalTransactions > 0
                    ? (
                        totalTransactions /
                        ((Date.now() - new Date(member.created_at).getTime()) /
                          (1000 * 60 * 60 * 24) +
                          1)
                      ).toFixed(2)
                    : "—"
                }
                size="lg"
              />
            </BLVCard>

            <BLVCard>
              <BLVMetric
                label="Average Routing Per Day"
                value={
                  totalTransactions > 0
                    ? `$${(
                        totalRoutingAmount /
                        ((Date.now() - new Date(member.created_at).getTime()) /
                          (1000 * 60 * 60 * 24) +
                          1)
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "—"
                }
                size="lg"
              />
            </BLVCard>

            <BLVCard>
              <BLVMetric
                label="Member Tenure (Days)"
                value={Math.floor(
                  (Date.now() - new Date(member.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
                size="lg"
              />
            </BLVCard>
          </BLVTwoColumn>
        </>
      )}
    </BLVPageContainer>
  );
}
