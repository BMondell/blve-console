"use client";
import React from "react";
import { Search, Bell, User, ChevronDown } from "lucide-react";

export const Header = () => {
  return (
    <header
      className="flex items-center justify-between px-6 py-4 flex-shrink-0"
      style={{
        background: "#0F1318",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.35)]"
            size={15}
          />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full text-sm pl-9 pr-4 py-2 rounded-xl text-white placeholder-[rgba(255,255,255,0.35)] focus:outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(59,130,246,0.5)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-6">
        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[rgba(255,255,255,0.50)] hover:text-white transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <Bell size={17} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3B82F6]"
            style={{ boxShadow: "0 0 6px #3B82F6" }}
          />
        </button>

        {/* Divider */}
        <div
          className="w-px h-6 mx-1"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* User */}
        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            }}
          >
            A
          </div>
          <span className="text-sm font-medium text-white hidden sm:block">Admin</span>
          <ChevronDown size={14} className="text-[rgba(255,255,255,0.35)] hidden sm:block" />
        </button>
      </div>
    </header>
  );
};
