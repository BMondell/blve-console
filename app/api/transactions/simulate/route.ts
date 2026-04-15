import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      kard_transaction_id,
      kard_token,
      gross_amount,
      merchant_id,
      offer_id,
    } = body;

    if (!kard_transaction_id || !kard_token || !gross_amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1) Resolve card → owner
    const { data: card, error: cardErr } = await supabase
      .from("cards")
      .select("id, owner_id")
      .eq("kard_token", kard_token)
      .single();

    if (cardErr || !card) {
      return NextResponse.json(
        { error: "Card not found for kard_token" },
        { status: 400 }
      );
    }

    // 2) Insert transaction
    const { data: tx, error: txErr } = await supabase
      .from("transactions")
      .insert({
        kard_transaction_id,
        kard_token,
        card_id: card.id,
        owner_id: card.owner_id,
        merchant_id,
        offer_id,
        gross_amount,
      })
      .select()
      .single();

    if (txErr || !tx) throw txErr;

    // 3) Resolve split config
    const { data: split, error: splitErr } = await supabase
      .from("card_split_config")
      .select("org_a_id, org_a_pct, org_b_id, org_b_pct")
      .eq("card_id", card.id)
      .single();

    if (splitErr || !split) {
      return NextResponse.json(
        { error: "No split config found for card" },
        { status: 400 }
      );
    }

    // 4) Build transaction_splits rows
    const pctToAmount = (pct: number) => (gross_amount * pct) / 100;
    const blveCut = (share: number) => share * 0.15;
    const netPayout = (share: number) => share * 0.85;

    const splitsToInsert = [];

    // Org A
    const orgAShare = pctToAmount(split.org_a_pct);
    splitsToInsert.push({
      transaction_id: tx.id,
      org_id: split.org_a_id,
      org_pct: split.org_a_pct,
      gross_share: orgAShare,
      blve_cut: blveCut(orgAShare),
      net_payout: netPayout(orgAShare),
      payout_status: "held",
    });

    // Org B (optional)
    if (split.org_b_id && split.org_b_pct) {
      const orgBShare = pctToAmount(split.org_b_pct);
      splitsToInsert.push({
        transaction_id: tx.id,
        org_id: split.org_b_id,
        org_pct: split.org_b_pct,
        gross_share: orgBShare,
        blve_cut: blveCut(orgBShare),
        net_payout: netPayout(orgBShare),
        payout_status: "held",
      });
    }

    const { error: splitsErr } = await supabase
      .from("transaction_splits")
      .insert(splitsToInsert);

    if (splitsErr) throw splitsErr;

    // 5) Emit event
    await supabase.from("events").insert({
      actor_type: "system",
      event_type: "transaction.simulated",
      payload: body,
    });

    return NextResponse.json({
      success: true,
      transaction_id: tx.id,
      splits_inserted: splitsToInsert.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
