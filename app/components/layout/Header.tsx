"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-blv-bg-secondary border-b border-blv-border px-blv-xl py-blv-lg flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-blv-md top-1/2 transform -translate-y-1/2 text-blv-text-tertiary" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-blv-bg border border-blv-border rounded-blv-lg pl-blv-xl pr-blv-lg py-blv-md text-blv-text placeholder-blv-text-tertiary focus:outline-none focus:border-blv-accent focus:shadow-blv-glow transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-blv-lg ml-blv-xl">
        <button className="p-blv-md hover:bg-blv-bg rounded-blv-lg transition-all duration-200 text-blv-text-secondary hover:text-blv-text">
          <Bell size={20} />
        </button>
        <button className="p-blv-md hover:bg-blv-bg rounded-blv-lg transition-all duration-200 text-blv-text-secondary hover:text-blv-text">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};
