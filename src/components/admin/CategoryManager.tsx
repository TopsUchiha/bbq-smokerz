'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toSlug } from '@/lib/utils'

interface Category { id: string; name: string; slug: string; active: boolean; order: number; _count: { products: number } }

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    setNewName('')
    setAdding(false)
    router.refresh()
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    setEditId(null)
    router.refresh()
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    router.refresh()
  }

  async function deleteCategory(id: string, name: string, count: number) {
    if (count > 0) { alert(`Can't delete "${name}" — it has ${count} products. Move or delete them first.`); return }
    if (!confirm(`Delete category "${name}"?`)) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={addCategory} className="flex gap-3 mb-8">
        <input
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="admin-input flex-1"
        />
        <button type="submit" disabled={adding} className="btn-primary disabled:opacity-50">Add</button>
      </form>

      <div className="card divide-y divide-coal-800">
        {categories.length === 0 && <p className="text-coal-500 text-sm p-4">No categories yet.</p>}
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 p-4">
            <div className="flex-1 min-w-0">
              {editId === cat.id ? (
                <div className="flex gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="admin-input flex-1"
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditId(null) }}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(cat.id)} className="text-green-400 text-sm hover:text-green-300">Save</button>
                  <button onClick={() => setEditId(null)} className="text-coal-400 text-sm hover:text-white">Cancel</button>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium text-sm">{cat.name}</p>
                  <p className="text-coal-500 text-xs">{cat._count.products} products · /{cat.slug}</p>
                </div>
              )}
            </div>
            {editId !== cat.id && (
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 ${cat.active ? 'bg-green-900/30 text-green-400' : 'bg-coal-800 text-coal-500'}`}>
                  {cat.active ? 'Active' : 'Hidden'}
                </span>
                <button onClick={() => { setEditId(cat.id); setEditName(cat.name) }} className="text-coal-400 hover:text-white text-xs">Edit</button>
                <button onClick={() => toggleActive(cat.id, cat.active)} className="text-coal-400 hover:text-white text-xs">{cat.active ? 'Hide' : 'Show'}</button>
                <button onClick={() => deleteCategory(cat.id, cat.name, cat._count.products)} className="text-red-500 hover:text-red-400 text-xs">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
