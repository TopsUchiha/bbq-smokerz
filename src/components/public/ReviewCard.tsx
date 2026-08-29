interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: Date
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-ember flex items-center justify-center text-white font-display font-bold text-sm">
          {review.name[0].toUpperCase()}
        </div>
        <div>
          <p className="text-white font-medium text-sm">{review.name}</p>
          <div className="flex text-ember text-xs">
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </div>
        </div>
      </div>
      <p className="text-coal-300 text-sm leading-relaxed">{review.comment}</p>
      <p className="text-coal-600 text-xs mt-3">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
    </div>
  )
}
