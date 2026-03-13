import Link from "next/link"

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-6">BLVE Admin</h2>

        <nav className="space-y-2">
          <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-100">
            Overview
          </Link>
          <Link href="/admin/transactions" className="block px-3 py-2 rounded-md hover:bg-gray-100">
            Transactions
          </Link>
          <Link href="/admin/fiu" className="block px-3 py-2 rounded-md hover:bg-gray-100">
            FIU
          </Link>
          <Link href="/admin/mas" className="block px-3 py-2 rounded-md hover:bg-gray-100">
            MAS
          </Link>
          <Link href="/admin/beast" className="block px-3 py-2 rounded-md hover:bg-gray-100">
            Beast
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
