"use client";
import React from "react";
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
} from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Organizations", href: "/admin/orgs", icon: Building2 },
    { label: "Members", href: "/admin/members", icon: Users },
    { label: "Merchants", href: "/admin/merchants", icon: CreditCard },
    { label: "Transactions", href: "/admin/transactions", icon: TrendingUp },
    { label: "Routing", href: "/admin/routing", icon: TrendingUp },
  ];

  return (
    <aside className="w-64 bg-[var(--blv-bg-secondary)] border-r border-[var(--blv-border)] flex flex-col">
      {/* Logo */}
      <div className="p-[var(--blv-xl)] border-b border-[var(--blv-border)]">
        <Link href="/" className="flex items-center gap-[var(--blv-md)] group">
          <div className="w-10 h-10 bg-[var(--blv-accent)] rounded-[var(--blv-radius-lg)] flex items-center justify-center text-[var(--blv-bg)] font-bold text-[1.125rem] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300">
            Ξ
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--blv-text-primary)]">BLVΞ</span>
            <span className="text-[0.75rem] text-[var(--blv-text-tertiary)]">Command Center</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-[var(--blv-lg)] space-y-[var(--blv-md)] overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-[var(--blv-md)] px-[var(--blv-lg)] py-[var(--blv-md)] rounded-[var(--blv-radius-lg)] transition-all duration-200 ${
                isActive
                  ? "bg-[var(--blv-accent)] text-[var(--blv-bg)]"
                  : "text-[var(--blv-text-secondary)] hover:bg-[var(--blv-bg)] hover:text-[var(--blv-text-primary)]"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--blv-border)] p-[var(--blv-lg)] space-y-[var(--blv-md)]">
        <button className="w-full flex items-center gap-[var(--blv-md)] px-[var(--blv-lg)] py-[var(--blv-md)] rounded-[var(--blv-radius-lg)] text-[var(--blv-text-secondary)] hover:bg-[var(--blv-bg)] hover:text-[var(--blv-text-primary)] transition-all duration-200">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-[var(--blv-md)] px-[var(--blv-lg)] py-[var(--blv-md)] rounded-[var(--blv-radius-lg)] text-[var(--blv-text-secondary)] hover:bg-red-900/20 hover:text-red-400 transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
