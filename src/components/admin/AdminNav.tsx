'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: '▣' },
  { href: '/admin/products', label: 'Products', icon: '◈' },
  { href: '/admin/categories', label: 'Categories', icon: '◎' },
  { href: '/admin/reviews', label: 'Reviews', icon: '★' },
  { href: '/admin/messages', label: 'Messages', icon: '✉' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = pathname === l.href || (l.href !== '/admin' && pathname.startsWith(l.href))
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-ember text-white' : 'text-coal-400 hover:text-white hover:bg-coal-800'}`}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-coal-900 border-b border-coal-800 h-14 flex items-center justify-between px-4">
        <span className="font-display font-bold text-ember">Admin</span>
        <button onClick={() => setOpen(!open)} className="text-white p-1">☰</button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-coal-950/80" onClick={() => setOpen(false)}>
          <div className="w-56 h-full bg-coal-900 border-r border-coal-800 p-4 pt-16" onClick={(e) => e.stopPropagation()}>
            {nav}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-coal-900 border-r border-coal-800 min-h-screen">
        <div className="p-4 border-b border-coal-800">
          <p className="font-display font-bold text-ember text-lg">BBQ Smokerz</p>
          <p className="text-coal-500 text-xs mt-0.5">Admin Panel</p>
        </div>
        <div className="flex-1 p-3">{nav}</div>
        <div className="p-3 border-t border-coal-800 space-y-1">
          <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2 text-sm text-coal-400 hover:text-white transition-colors">
            <span>↗</span> View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-coal-400 hover:text-red-400 transition-colors"
          >
            <span>⏻</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
