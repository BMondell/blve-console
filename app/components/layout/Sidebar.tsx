"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Zap,
  Route,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",     href: "/admin",               icon: LayoutDashboard },
  { label: "Organizations", href: "/admin/orgs",          icon: Building2 },
  { label: "Members",       href: "/admin/members",       icon: Users },
  { label: "Merchants",     href: "/admin/merchants",     icon: CreditCard },
  { label: "Transactions",  href: "/admin/transactions",  icon: TrendingUp },
  { label: "Routing",       href: "/admin/routing",       icon: Route },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col"
      style={{
        background: "#0F1318",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────────── */}
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            boxShadow: "0 0 20px rgba(59,130,246,0.35)",
            color: "#fff",
          }}
        >
          Ξ
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-white tracking-tight">BLVΞ</span>
          <span className="text-xs text-[rgba(255,255,255,0.35)] font-medium">Command Center</span>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-white"
                  : "text-[rgba(255,255,255,0.50)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.20) 0%, rgba(59,130,246,0.10) 100%)",
                      border: "1px solid rgba(59,130,246,0.25)",
                    }
                  : {}
              }
            >
              <Icon
                size={18}
                className={isActive ? "text-[#3B82F6]" : ""}
              />
              {item.label}
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B82F6]"
                  style={{ boxShadow: "0 0 6px #3B82F6" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <div
        className="px-3 py-4 space-y-1"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[rgba(255,255,255,0.50)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200">
          <Settings size={18} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[rgba(255,255,255,0.50)] hover:text-[#F87171] hover:bg-[rgba(248,113,113,0.08)] transition-all duration-200">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
