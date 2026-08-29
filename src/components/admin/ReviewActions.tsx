'use client'

import { useRouter } from 'next/navigation'

export default function ReviewActions({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter()

  async function toggle() {
    await fetch(`/api/admin/reviews/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: !approved }) })
    router.refresh()
  }

  async function remove() {
    if (!confirm('Delete this review?')) return
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="flex gap-3 flex-shrink-0">
      <button onClick={toggle} className={`text-xs px-2 py-1 transition-colors ${approved ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
        {approved ? 'Unapprove' : 'Approve'}
      </button>
      <button onClick={remove} className="text-xs text-red-500 hover:text-red-400 transition-colors">Delete</button>
    </div>
  )
}
