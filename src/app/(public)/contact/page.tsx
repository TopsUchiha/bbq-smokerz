export const dynamic = 'force-dynamic'
'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMsg(data.message); setForm({ name: '', email: '', phone: '', message: '' }) }
      else { setStatus('error'); setMsg(data.error || 'Something went wrong') }
    } catch {
      setStatus('error'); setMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display font-bold text-5xl text-white mb-3">Get in Touch</h1>
      <p className="text-coal-400 mb-10">Questions about a build, custom orders, shipping — we'll get back to you.</p>

      {status === 'success' ? (
        <div className="bg-emerald-900/30 border border-emerald-700 p-6 text-emerald-300">{msg}</div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="admin-label" htmlFor="name">Name *</label>
              <input id="name" required className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label" htmlFor="email">Email *</label>
              <input id="email" type="email" required className="admin-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="admin-label" htmlFor="phone">Phone (optional)</label>
            <input id="phone" type="tel" className="admin-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="admin-label" htmlFor="message">Message *</label>
            <textarea id="message" required rows={6} className="admin-input resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          {status === 'error' && <p className="text-red-400 text-sm">{msg}</p>}
          <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-50">
            {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
