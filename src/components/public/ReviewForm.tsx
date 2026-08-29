'use client'

import { useState } from 'react'

export default function ReviewForm({ productId }: { productId?: string }) {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, comment: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, productId }),
      })
      const data = await res.json()
      if (res.ok) { setStatus('success'); setMsg(data.message); setForm({ name: '', email: '', rating: 5, comment: '' }) }
      else { setStatus('error'); setMsg(data.error || 'Something went wrong') }
    } catch {
      setStatus('error'); setMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return <div className="bg-emerald-900/30 border border-emerald-700 p-4 text-emerald-300 text-sm">{msg}</div>
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="admin-label" htmlFor="r-name">Name *</label>
          <input id="r-name" required className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="admin-label" htmlFor="r-email">Email *</label>
          <input id="r-email" type="email" required className="admin-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="admin-label">Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm({ ...form, rating: n })}
              className={`text-2xl transition-colors ${n <= form.rating ? 'text-ember' : 'text-coal-700'}`}
            >★</button>
          ))}
        </div>
      </div>
      <div>
        <label className="admin-label" htmlFor="r-comment">Review *</label>
        <textarea id="r-comment" required rows={4} className="admin-input resize-none" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
      </div>
      {status === 'error' && <p className="text-red-400 text-sm">{msg}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-50">
        {status === 'loading' ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
