import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getSetting, formatPrice } from '@/lib/utils'
import ReviewCard from '@/components/public/ReviewCard'
import ReviewForm from '@/components/public/ReviewForm'

export default async function HomePage() {
  const [settings, featuredProducts, approvedReviews, categories] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.product.findMany({ where: { featured: true, published: true, available: true }, include: { category: true }, take: 3, orderBy: { createdAt: 'desc' } }),
    prisma.review.findMany({ where: { approved: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ])

  const get = (key: string, fallback = '') => getSetting(settings, key, fallback)
  const heroHeadline = get('hero_headline', 'Built to Smoke.\nBuilt to Last.')
  const heroSub = get('hero_subheadline', 'Custom BBQ smokers built around the way you cook.')
  const aboutTitle = get('about_title', 'Why BBQ Smokerz?')
  const aboutBody = get('about_body', '')
  const shippingInfo = get('shipping_info', '')

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-coal-950">
        <div className="absolute inset-0 bg-gradient-to-r from-coal-950 via-coal-950/80 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600')" }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <p className="section-label mb-4">BBQ Smokerz</p>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-none mb-6 whitespace-pre-line">
            {heroHeadline.split('\n').map((line, i) => (
              <span key={i} className={i === 1 ? 'text-ember' : ''}>
                {line}{i < heroHeadline.split('\n').length - 1 ? '\n' : ''}
              </span>
            ))}
          </h1>
          <p className="text-coal-300 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">{heroSub}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary">Shop Smokers</Link>
            <Link href="/#contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="py-16 bg-coal-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="section-label mb-2">Browse by type</p>
            <h2 className="section-title text-3xl mb-8">What are you looking for?</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="border border-coal-700 text-coal-300 hover:border-ember hover:text-ember font-display tracking-wider uppercase text-sm px-5 py-2 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link href="/products" className="border border-coal-700 text-coal-300 hover:border-ember hover:text-ember font-display tracking-wider uppercase text-sm px-5 py-2 transition-colors">
                All Smokers
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-coal-950 border-t border-coal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-label mb-2">Our builds</p>
          <h2 className="section-title text-4xl mb-12">Featured Smokers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group card overflow-hidden hover:border-coal-600 transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  {p.category && <p className="section-label text-xs mb-1">{p.category.name}</p>}
                  <h3 className="font-display font-semibold text-xl text-white mb-2">{p.name}</h3>
                  <p className="text-coal-400 text-sm line-clamp-2 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-ember text-2xl">{formatPrice(p.price)}</span>
                    <span className="text-coal-400 text-sm group-hover:text-white transition-colors">View details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products" className="btn-outline">View All Smokers</Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 bg-coal-900 border-t border-coal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="section-label mb-2">About us</p>
            <h2 className="section-title text-4xl mb-6">{aboutTitle}</h2>
            {aboutBody.split('\n\n').map((para, i) => (
              <p key={i} className="text-coal-300 leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* SHIPPING */}
      {shippingInfo && (
        <section className="py-12 bg-coal-950 border-t border-coal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 items-start">
              <span className="text-ember text-2xl mt-1">🚚</span>
              <div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">Shipping</h3>
                <p className="text-coal-300">{shippingInfo}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS */}
      {approvedReviews.length > 0 && (
        <section className="py-20 bg-coal-900 border-t border-coal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="section-label mb-2">Customer reviews</p>
            <h2 className="section-title text-4xl mb-12">What people say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {approvedReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
            <div className="border-t border-coal-800 pt-12">
              <h3 className="section-title text-2xl mb-6">Leave a review</h3>
              <div className="max-w-xl">
                <ReviewForm />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-ember">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl text-white mb-4">Ready to talk smokers?</h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">Got questions about a build, want something custom, or just want to know more? We'll get back to you.</p>
          <Link href="/contact" className="inline-flex items-center justify-center bg-white text-ember font-display font-semibold tracking-wider uppercase text-sm px-8 py-4 hover:bg-coal-950 hover:text-white transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
