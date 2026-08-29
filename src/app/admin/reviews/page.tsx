import { prisma } from '@/lib/prisma'
import ReviewActions from '@/components/admin/ReviewActions'

export const metadata = { title: 'Reviews – Admin' }

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const pending = reviews.filter((r) => !r.approved)
  const approved = reviews.filter((r) => r.approved)

  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Reviews</h1>

      {pending.length > 0 && (
        <div className="mb-10">
          <h2 className="font-display font-semibold text-yellow-400 mb-4">Pending Approval ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-medium text-sm">{r.name}</span>
                      <span className="text-coal-400 text-xs">{r.email}</span>
                      <span className="text-ember text-xs">{'★'.repeat(r.rating)}</span>
                    </div>
                    {r.product && <p className="text-coal-500 text-xs mb-2">Re: {r.product.name}</p>}
                    <p className="text-coal-300 text-sm">{r.comment}</p>
                    <p className="text-coal-600 text-xs mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ReviewActions id={r.id} approved={r.approved} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold text-white mb-4">Approved ({approved.length})</h2>
        <div className="space-y-3">
          {approved.length === 0 && <p className="text-coal-500 text-sm">No approved reviews yet.</p>}
          {approved.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-medium text-sm">{r.name}</span>
                    <span className="text-ember text-xs">{'★'.repeat(r.rating)}</span>
                    {r.product && <span className="text-coal-500 text-xs">Re: {r.product.name}</span>}
                  </div>
                  <p className="text-coal-300 text-sm">{r.comment}</p>
                </div>
                <ReviewActions id={r.id} approved={r.approved} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
