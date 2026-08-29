import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Dashboard – Admin' }

export default async function AdminDashboard() {
  const [productCount, categoryCount, pendingReviews, unreadMessages, recentProducts, recentMessages] = await Promise.all([
    prisma.product.count({ where: { published: true } }),
    prisma.category.count({ where: { active: true } }),
    prisma.review.count({ where: { approved: false } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.product.findMany({ take: 5, orderBy: { updatedAt: 'desc' }, include: { category: true } }),
    prisma.contactMessage.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ])

  const stats = [
    { label: 'Published Products', value: productCount, href: '/admin/products', color: 'text-ember' },
    { label: 'Active Categories', value: categoryCount, href: '/admin/categories', color: 'text-blue-400' },
    { label: 'Pending Reviews', value: pendingReviews, href: '/admin/reviews', color: 'text-yellow-400' },
    { label: 'Unread Messages', value: unreadMessages, href: '/admin/messages', color: 'text-green-400' },
  ]

  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:border-coal-600 transition-colors">
            <p className={`font-display font-bold text-4xl ${s.color} mb-1`}>{s.value}</p>
            <p className="text-coal-400 text-sm">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent products */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-coal-800">
            <h2 className="font-display font-semibold text-white">Recent Products</h2>
            <Link href="/admin/products" className="text-ember text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-coal-800">
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-white text-sm font-medium">{p.name}</p>
                  <p className="text-coal-500 text-xs">{p.category?.name || 'Uncategorized'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 ${p.available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {p.available ? 'Available' : 'Unavailable'}
                  </span>
                  <Link href={`/admin/products/${p.id}/edit`} className="text-coal-400 hover:text-white text-xs">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-coal-800">
            <h2 className="font-display font-semibold text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-ember text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-coal-800">
            {recentMessages.length === 0 && <p className="text-coal-500 text-sm p-4">No messages yet.</p>}
            {recentMessages.map((m) => (
              <div key={m.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white text-sm font-medium">{m.name}</p>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-ember" />}
                </div>
                <p className="text-coal-400 text-xs line-clamp-1">{m.message}</p>
                <p className="text-coal-600 text-xs mt-1">{new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
