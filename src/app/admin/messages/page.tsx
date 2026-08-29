import { prisma } from '@/lib/prisma'
import MessageActions from '@/components/admin/MessageActions'

export const metadata = { title: 'Messages – Admin' }

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Messages</h1>

      {messages.length === 0 && <p className="text-coal-500">No messages yet.</p>}

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`card p-5 ${!m.read ? 'border-coal-600' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  {!m.read && <span className="w-2 h-2 rounded-full bg-ember flex-shrink-0" />}
                  <span className="text-white font-medium">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-ember text-sm hover:underline">{m.email}</a>
                  {m.phone && <span className="text-coal-400 text-sm">{m.phone}</span>}
                </div>
                <p className="text-coal-300 text-sm leading-relaxed">{m.message}</p>
                <p className="text-coal-600 text-xs mt-2">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <MessageActions id={m.id} read={m.read} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
