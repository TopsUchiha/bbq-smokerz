export const dynamic = 'force-dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

interface Props { searchParams: { category?: string; q?: string } }

export const metadata = { title: 'Shop Smokers' }

export default async function ProductsPage({ searchParams }: Props) {
  const { category, q } = searchParams

  const where = {
    published: true,
    available: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' as const } }, { description: { contains: q, mode: 'insensitive' as const } }] } : {}),
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display font-bold text-5xl text-white mb-2">Our Smokers</h1>
      <p className="text-coal-400 mb-10">All smokers are built to order. Lead times vary — contact us for details.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link href="/products" className={`font-display tracking-wider uppercase text-sm px-4 py-2 border transition-colors ${!category ? 'border-ember text-ember' : 'border-coal-700 text-coal-400 hover:border-ember hover:text-ember'}`}>All</Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`} className={`font-display tracking-wider uppercase text-sm px-4 py-2 border transition-colors ${category === cat.slug ? 'border-ember text-ember' : 'border-coal-700 text-coal-400 hover:border-ember hover:text-ember'}`}>{cat.name}</Link>
        ))}
      </div>

      {/* Search */}
      <form className="mb-10 flex gap-2 max-w-md">
        <input name="q" defaultValue={q} placeholder="Search smokers..." className="admin-input flex-1" />
        <button type="submit" className="btn-primary px-4">Search</button>
      </form>

      {products.length === 0 ? (
        <div className="text-center py-20 text-coal-500">
          <p className="text-xl mb-4">No smokers found.</p>
          <Link href="/products" className="text-ember hover:underline">Clear filters</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group card overflow-hidden hover:border-coal-600 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <Image src={p.imageUrl} alt={p.name} width={600} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                {p.category && <p className="section-label text-xs mb-1">{p.category.name}</p>}
                <h2 className="font-display font-semibold text-xl text-white mb-2">{p.name}</h2>
                <p className="text-coal-400 text-sm line-clamp-2 mb-4">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-ember text-2xl">{formatPrice(p.price)}</span>
                  <span className="text-coal-400 text-sm group-hover:text-white transition-colors">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
