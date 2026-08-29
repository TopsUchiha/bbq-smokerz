'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category { id: string; name: string }
interface Product {
  id?: string
  name?: string
  description?: string
  price?: number
  imageUrl?: string
  images?: string[]
  categoryId?: string | null
  featured?: boolean
  available?: boolean
  published?: boolean
  material?: string | null
  dimensions?: string | null
  weight?: string | null
  features?: string[]
}

export default function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    imageUrl: product?.imageUrl || '',
    images: product?.images?.join('\n') || '',
    categoryId: product?.categoryId || '',
    featured: product?.featured ?? false,
    available: product?.available ?? true,
    published: product?.published ?? true,
    material: product?.material || '',
    dimensions: product?.dimensions || '',
    weight: product?.weight || '',
    features: product?.features?.join('\n') || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      ...form,
      price: parseFloat(form.price),
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
      categoryId: form.categoryId || null,
    }

    const url = product?.id ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const method = product?.id ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { router.push('/admin/products'); router.refresh() }
      else { const d = await res.json(); setError(d.error || 'Something went wrong') }
    } catch {
      setError('Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="admin-label">Product Name *</label>
          <input required className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Price (USD) *</label>
          <input type="number" step="0.01" min="0" required className="admin-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Category</label>
          <select className="admin-input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Description *</label>
          <textarea required rows={5} className="admin-input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Main Image URL *</label>
          <input required type="url" className="admin-input" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <p className="text-coal-500 text-xs mt-1">Use Unsplash, Cloudinary, or any public image URL</p>
        </div>
        <div className="sm:col-span-2">
          <label className="admin-label">Additional Image URLs (one per line)</label>
          <textarea rows={3} className="admin-input resize-none" placeholder="https://..." value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="admin-label">Material</label>
          <input className="admin-input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Dimensions</label>
          <input className="admin-input" placeholder='48"L x 24"W' value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Weight</label>
          <input className="admin-input" placeholder="185 lbs" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
        </div>
      </div>

      <div>
        <label className="admin-label">Features (one per line)</label>
        <textarea rows={4} className="admin-input resize-none" placeholder="Side firebox&#10;Heavy-duty grates&#10;Drain valve" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
      </div>

      <div className="flex flex-wrap gap-6">
        {([['featured', 'Featured on homepage'], ['available', 'Available for requests'], ['published', 'Published (visible to customers)']] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-ember"
              checked={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
            />
            <span className="text-coal-300 text-sm">{label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Saving...' : product?.id ? 'Save Changes' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}
