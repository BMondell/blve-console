"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import IdentityLayer from "@/components/IdentityLayer";

export default function AdminDashboard() {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [orgCount, setOrgCount] = useState<number | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadStats() {
      const { count: members } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });

      const { count: orgs } = await supabase
        .from("orgs")
        .select("*", { count: "exact", head: true });

      const { count: txs } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true });

      setMemberCount(members ?? 0);
      setOrgCount(orgs ?? 0);
      setTxCount(txs ?? 0);
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">BLVE Admin Dashboard</h1>

      {/* Top-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Members</h2>
          <p className="text-3xl font-bold mt-2">{memberCount ?? "…"}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Organizations</h2>
          <p className="text-3xl font-bold mt-2">{orgCount ?? "…"}</p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow border">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-3xl font-bold mt-2">{txCount ?? "…"}</p>
        </div>
      </div>

      {/* Identity Layer (live data) */}
      <IdentityLayer />
    </div>
  );
}
