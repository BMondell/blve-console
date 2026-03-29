import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const url = new URL(req.url);
  const orgId = url.searchParams.get("id");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: orgs, error: orgsError } = await supabase
    .from("organizations")
    .select("*");

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("*");

  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("*");

  if (orgsError || membersError || txError) {
    console.error(orgsError || membersError || txError);
    return new Response(
      JSON.stringify({ error: "Failed to load data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // No orgId → full dataset
  if (!orgId) {
    return new Response(
      JSON.stringify({ orgs, members, transactions }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Find the org by ID (string-compare)
  const org = orgs?.find((o) => String(o.id) === String(orgId));

  if (!org) {
    return new Response(
      JSON.stringify({ error: "Org not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Sub‑orgs: parent_org_id matches this org.id (string-compare)
  const suborgs = orgs!.filter(
    (o) => o.parent_org_id && String(o.parent_org_id) === String(org.id)
  );

  // Members: belong to this org OR any sub‑org (string-compare)
  const orgMembers = members!.filter(
    (m) =>
      m.org_id &&
      (String(m.org_id) === String(org.id) ||
        suborgs.some((s) => String(s.id) === String(m.org_id)))
  );

  // Transactions: belong to this org OR any sub‑org (string-compare)
  const orgTransactions = transactions!.filter(
    (t) =>
      t.org_id &&
      (String(t.org_id) === String(org.id) ||
        suborgs.some((s) => String(s.id) === String(t.org_id)))
  );

  return new Response(
    JSON.stringify({
      org,
      suborgs,
      members: orgMembers,
      transactions: orgTransactions,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
