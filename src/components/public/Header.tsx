'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-coal-950/95 backdrop-blur border-b border-coal-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-display font-bold text-xl text-white tracking-wider hover:text-ember transition-colors">
            {siteName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-coal-300 hover:text-white font-display tracking-wider uppercase text-sm transition-colors">Shop</Link>
            <Link href="/contact" className="text-coal-300 hover:text-white font-display tracking-wider uppercase text-sm transition-colors">Contact</Link>
            <Link href="/products" className="btn-primary text-xs py-2 px-4">Shop Smokers</Link>
          </nav>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-coal-800 bg-coal-950">
          <div className="px-4 py-4 space-y-3">
            <Link href="/products" onClick={() => setOpen(false)} className="block text-coal-300 hover:text-white font-display tracking-wider uppercase text-sm py-2">Shop</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="block text-coal-300 hover:text-white font-display tracking-wider uppercase text-sm py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  )
}
