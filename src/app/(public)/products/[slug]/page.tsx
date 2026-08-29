import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import ReviewCard from '@/components/public/ReviewCard'
import ReviewForm from '@/components/public/ReviewForm'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!product) return {}
  return { title: product.name, description: product.description.slice(0, 160) }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      category: true,
      reviews: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
    },
  })

  if (!product) notFound()

  const avgRating = product.reviews.length
    ? Math.round(product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length)
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/products" className="text-coal-400 hover:text-white text-sm mb-8 inline-block">← Back to smokers</Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image */}
        <div>
          <div className="aspect-[4/3] overflow-hidden bg-coal-900">
            <Image src={product.imageUrl} alt={product.name} width={800} height={600} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 0 && (
            <div className="flex gap-2 mt-2">
              {product.images.map((img, i) => (
                <div key={i} className="w-20 h-20 overflow-hidden bg-coal-900">
                  <Image src={img} alt={`${product.name} view ${i + 2}`} width={80} height={80} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && <p className="section-label mb-2">{product.category.name}</p>}
          <h1 className="font-display font-bold text-4xl text-white mb-2">{product.name}</h1>

          {avgRating !== null && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-ember">{'★'.repeat(avgRating)}{'☆'.repeat(5 - avgRating)}</div>
              <span className="text-coal-400 text-sm">({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}

          <p className="font-display font-bold text-ember text-4xl mb-6">{formatPrice(product.price)}</p>
          <p className="text-coal-300 leading-relaxed mb-8">{product.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/contact" className="btn-primary">Request This Smoker</Link>
            <Link href="/contact" className="btn-outline">Ask a Question</Link>
          </div>

          {/* Specs */}
          {(product.material || product.dimensions || product.weight) && (
            <div className="border-t border-coal-800 pt-6 mb-6">
              <h3 className="font-display font-semibold text-white mb-4">Specs</h3>
              <dl className="grid grid-cols-1 gap-2">
                {product.material && (
                  <div className="flex justify-between py-2 border-b border-coal-800">
                    <dt className="text-coal-400 text-sm">Material</dt>
                    <dd className="text-white text-sm">{product.material}</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between py-2 border-b border-coal-800">
                    <dt className="text-coal-400 text-sm">Dimensions</dt>
                    <dd className="text-white text-sm">{product.dimensions}</dd>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between py-2 border-b border-coal-800">
                    <dt className="text-coal-400 text-sm">Weight</dt>
                    <dd className="text-white text-sm">{product.weight}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Features */}
          {product.features.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-coal-300 text-sm">
                    <span className="text-ember">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-coal-800 pt-16">
        <h2 className="section-title text-3xl mb-8">Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {product.reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <p className="text-coal-400 mb-12">No reviews yet. Be the first.</p>
        )}
        <div className="max-w-xl">
          <h3 className="section-title text-2xl mb-6">Leave a Review</h3>
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  )
}
