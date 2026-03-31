"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-[var(--blv-bg)]-secondary border-b border-[var(--blv-border)] px-[var(--blv-xl)] py-[var(--blv-lg)] flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-blv-md top-1/2 transform -translate-y-1/2 text-[var(--blv-text-primary)]-tertiary" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[var(--blv-bg)] border border-[var(--blv-border)] rounded-[var(--blv-radius-lg)] pl-[var(--blv-xl)] pr-[var(--blv-lg)] py-[var(--blv-md)] text-[var(--blv-text-primary)] placeholder-blv-text-tertiary focus:outline-none focus:border-blv-accent focus:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-[var(--blv-lg)] ml-[var(--blv-xl)]">
        <button className="p-[var(--blv-md)] hover:bg-[var(--blv-bg)] rounded-[var(--blv-radius-lg)] transition-all duration-200 text-[var(--blv-text-primary)]-secondary hover:text-[var(--blv-text-primary)]">
          <Bell size={20} />
        </button>
        <button className="p-[var(--blv-md)] hover:bg-[var(--blv-bg)] rounded-[var(--blv-radius-lg)] transition-all duration-200 text-[var(--blv-text-primary)]-secondary hover:text-[var(--blv-text-primary)]">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};
