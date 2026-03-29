import { NextResponse } from "next/server";

const SUPABASE_FUNCTION_URL =
  process.env.SUPABASE_FUNCTION_ORG_DASHBOARD_URL!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const url = new URL(SUPABASE_FUNCTION_URL);
  if (id) {
    url.searchParams.set("id", id);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // This is the missing piece:
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
