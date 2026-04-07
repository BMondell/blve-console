import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Fetch user + roles
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: roles } = await supabase
    .from("members")
    .select("role_member, role_org_owner, role_merchant_owner")
    .eq("id", user.id)
    .single();

  // Count roles
  const count =
    (roles?.role_member ? 1 : 0) +
    (roles?.role_org_owner ? 1 : 0) +
    (roles?.role_merchant_owner ? 1 : 0);

  // Multi-role → /selectrole
  if (count > 1) {
    return NextResponse.redirect(new URL("/selectrole", request.url));
  }

  // Single-role redirects
  if (roles?.role_org_owner) {
    return NextResponse.redirect(new URL("/org", request.url));
  }

  if (roles?.role_member) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  if (roles?.role_merchant_owner) {
    return NextResponse.redirect(new URL("/merchant", request.url));
  }

  // Default: admin
  return NextResponse.redirect(new URL("/admin", request.url));
}

