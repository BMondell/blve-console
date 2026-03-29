import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <nav className="space-y-2">

          <Link href="/admin" className="block p-2 hover:bg-gray-100 rounded">
            Dashboard
          </Link>

          <Link
            href="/admin/transactions"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            Transactions
          </Link>

          <Link
            href="/admin/members"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            Members
          </Link>

          <Link
            href="/admin/merchants"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            Merchants
          </Link>

          <Link
            href="/admin/events"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            Events
          </Link>

          <Link
            href="/admin/orgs"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            Organizations
          </Link>

          <Link
            href="/admin/routing"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            Routing
          </Link>

        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
