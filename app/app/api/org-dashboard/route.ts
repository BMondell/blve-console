import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Fetch orgs
    const { data: orgs, error: orgError } = await supabase
      .from("organizations")
      .select("*");

    if (orgError) throw orgError;

    // Fetch members
    const { data: members, error: memberError } = await supabase
      .from("members")
      .select("*");

    if (memberError) throw memberError;

    // Fetch routing summary
    const { data: routing, error: routingError } = await supabase
      .from("routing")
      .select("*");

    if (routingError) throw routingError;

    return NextResponse.json(
      {
        success: true,
        orgs,
        members,
        routing,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("org-dashboard error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
