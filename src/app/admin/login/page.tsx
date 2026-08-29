'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { ...form, redirect: false })
    if (result?.ok) { router.push('/admin') }
    else { setError('Invalid email or password'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-coal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <p className="font-display font-bold text-ember text-2xl tracking-wider mb-1">BBQ Smokerz</p>
        <h1 className="font-display font-bold text-white text-3xl mb-8">Admin Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="admin-label" htmlFor="email">Email</label>
            <input id="email" type="email" required className="admin-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="admin-label" htmlFor="password">Password</label>
            <input id="password" type="password" required className="admin-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
