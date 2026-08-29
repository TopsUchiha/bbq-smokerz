'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FIELDS = [
  { section: 'Business', fields: [
    { key: 'site_name', label: 'Business Name', type: 'text' },
    { key: 'contact_email', label: 'Contact Email', type: 'email' },
    { key: 'contact_phone', label: 'Phone', type: 'text' },
    { key: 'contact_address', label: 'Address', type: 'text' },
  ]},
  { section: 'Hero', fields: [
    { key: 'hero_headline', label: 'Hero Headline (use newlines for line breaks)', type: 'textarea' },
    { key: 'hero_subheadline', label: 'Hero Subheadline', type: 'textarea' },
  ]},
  { section: 'About', fields: [
    { key: 'about_title', label: 'About Section Title', type: 'text' },
    { key: 'about_body', label: 'About Body (use blank lines for paragraphs)', type: 'textarea' },
  ]},
  { section: 'Shipping & Footer', fields: [
    { key: 'shipping_info', label: 'Shipping Info', type: 'textarea' },
    { key: 'footer_tagline', label: 'Footer Tagline', type: 'text' },
  ]},
  { section: 'Social', fields: [
    { key: 'social_facebook', label: 'Facebook URL', type: 'url' },
    { key: 'social_instagram', label: 'Instagram URL', type: 'url' },
  ]},
]

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, string>>(settings)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('saved'); router.refresh(); setTimeout(() => setStatus('idle'), 3000) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-10">
      {FIELDS.map(({ section, fields }) => (
        <div key={section}>
          <h2 className="font-display font-semibold text-ember text-sm tracking-widest uppercase mb-4">{section}</h2>
          <div className="space-y-4">
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    rows={4}
                    className="admin-input resize-none"
                    value={form[key] ?? ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    type={type}
                    className="admin-input"
                    value={form[key] ?? ''}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={status === 'saving'} className="btn-primary disabled:opacity-50">
          {status === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>
        {status === 'saved' && <span className="text-green-400 text-sm">Settings saved.</span>}
        {status === 'error' && <span className="text-red-400 text-sm">Something went wrong.</span>}
      </div>
    </form>
  )
}
