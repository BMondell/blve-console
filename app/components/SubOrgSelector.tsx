"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { BLVCard } from "@/components/blve";
import { Building2, Target, ChevronRight } from "lucide-react";

interface SubOrg {
  id: string;
  name: string;
  slug: string;
  routing_pool: number;
  org_type: string;
  parent_org_id: string | null;
  category: string;
  subcategory: string | null;
}

interface SubOrgSelectorProps {
  currentOrgSlug: string;
  onOrgChange: (slug: string) => void;
}

export default function SubOrgSelector({
  currentOrgSlug,
  onOrgChange,
}: SubOrgSelectorProps) {
  const [subOrgs, setSubOrgs] = useState<SubOrg[]>([]);
  const [parentOrg, setParentOrg] = useState<SubOrg | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchSubOrgs();
  }, [currentOrgSlug]);

  async function fetchSubOrgs() {
    setLoading(true);

    try {
      // Get current org info
      const { data: currentOrg } = await supabase
        .from("org_dashboard_view")
        .select("*")
        .eq("slug", currentOrgSlug)
        .single();

      if (currentOrg) {
        if (currentOrg.org_type === "parent") {
          // Fetch all sub-orgs under this parent
          const { data } = await supabase
            .from("org_dashboard_view")
            .select("*")
            .eq("parent_org_id", currentOrg.id)
            .order("name");

          setParentOrg(currentOrg);
          setSubOrgs(data || []);
        } else {
          // This is a sub-org, fetch its siblings and parent
          const { data: siblings } = await supabase
            .from("org_dashboard_view")
            .select("*")
            .eq("parent_org_id", currentOrg.parent_org_id)
            .order("name");

          const { data: parent } = await supabase
            .from("org_dashboard_view")
            .select("*")
            .eq("id", currentOrg.parent_org_id)
            .single();

          setParentOrg(parent || null);
          setSubOrgs(siblings || []);
        }
      }
    } catch (error) {
      console.error("Error fetching sub-orgs:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || subOrgs.length === 0) return null;

  return (
    <BLVCard className="p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Target size={18} className="text-black" />
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Sub-Organizations
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {parentOrg && (
          <button
            onClick={() => onOrgChange(parentOrg.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 text-sm font-bold ${
              currentOrgSlug === parentOrg.slug
                ? "bg-black text-white border-black shadow-lg shadow-black/10"
                : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
            }`}
          >
            <Building2 size={16} />
            {parentOrg.name}
          </button>
        )}

        {subOrgs.map((subOrg) => (
          <button
            key={subOrg.id}
            onClick={() => onOrgChange(subOrg.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 text-sm font-bold ${
              currentOrgSlug === subOrg.slug
                ? "bg-black text-white border-black shadow-lg shadow-black/10"
                : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
            }`}
          >
            <span className="text-lg">{getSportEmoji(subOrg.name)}</span>
            {subOrg.name}
          </button>
        ))}
      </div>
    </BLVCard>
  );
}

function getSportEmoji(name: string): string {
  const sportEmojis: { [key: string]: string } = {
    Football: "🏈",
    Basketball: "🏀",
    Baseball: "⚾",
    Swimming: "🏊",
    Track: "🏃",
    Soccer: "⚽",
    Tennis: "🎾",
    Volleyball: "🏐",
    Golf: "⛳",
    Hockey: "🏒",
    Support: "🎓",
    Research: "🔬",
  };

  for (const [sport, emoji] of Object.entries(sportEmojis)) {
    if (name.includes(sport)) return emoji;
  }

  return "🏆";
}
