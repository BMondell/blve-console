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
    <aside className="w-64 bg-blv-bg-secondary border-r border-blv-border flex flex-col">
      {/* Logo */}
      <div className="p-blv-xl border-b border-blv-border">
        <Link href="/" className="flex items-center gap-blv-md group">
          <div className="w-10 h-10 bg-blv-accent rounded-blv-lg flex items-center justify-center text-blv-bg font-bold text-blv-lg group-hover:shadow-blv-glow transition-all duration-300">
            Ξ
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-blv-text">BLVΞ</span>
            <span className="text-blv-xs text-blv-text-tertiary">Command Center</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-blv-lg space-y-blv-md overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-blv-md px-blv-lg py-blv-md rounded-blv-lg transition-all duration-200 ${
                isActive
                  ? "bg-blv-accent text-blv-bg"
                  : "text-blv-text-secondary hover:bg-blv-bg hover:text-blv-text"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-blv-border p-blv-lg space-y-blv-md">
        <button className="w-full flex items-center gap-blv-md px-blv-lg py-blv-md rounded-blv-lg text-blv-text-secondary hover:bg-blv-bg hover:text-blv-text transition-all duration-200">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-blv-md px-blv-lg py-blv-md rounded-blv-lg text-blv-text-secondary hover:bg-red-900/20 hover:text-red-400 transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
