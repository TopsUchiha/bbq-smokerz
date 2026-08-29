'use client'

import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
    else alert('Failed to delete product')
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:text-red-400 text-xs transition-colors">
      Delete
    </button>
  )
}
