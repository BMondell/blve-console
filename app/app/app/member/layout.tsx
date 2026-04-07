"use client";

import Link from "next/link";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-green-700 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Member</h1>

        <nav className="space-y-3">
          <Link href="/member" className="block hover:text-green-300">
            Dashboard
          </Link>

          <Link href="/member/profile" className="block hover:text-green-300">
            Profile
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
