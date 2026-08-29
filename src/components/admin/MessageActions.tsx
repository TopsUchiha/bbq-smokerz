'use client'

import { useRouter } from 'next/navigation'

export default function MessageActions({ id, read }: { id: string; read: boolean }) {
  const router = useRouter()

  async function toggleRead() {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !read }),
    })
    router.refresh()
  }

  async function remove() {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="flex gap-3 flex-shrink-0">
      <button onClick={toggleRead} className="text-xs text-coal-400 hover:text-white transition-colors">
        {read ? 'Mark unread' : 'Mark read'}
      </button>
      <button onClick={remove} className="text-xs text-red-500 hover:text-red-400 transition-colors">Delete</button>
    </div>
  )
}
