import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export const metadata = { title: 'Products – Admin' }

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="lg:pt-0 pt-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add Product</Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-coal-800">
              <tr>
                <th className="text-left p-4 text-coal-400 font-medium">Product</th>
                <th className="text-left p-4 text-coal-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-coal-400 font-medium">Price</th>
                <th className="text-left p-4 text-coal-400 font-medium hidden sm:table-cell">Status</th>
                <th className="text-right p-4 text-coal-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coal-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-coal-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 overflow-hidden flex-shrink-0 bg-coal-800">
                        <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-coal-500 text-xs">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-coal-300 hidden md:table-cell">{p.category?.name || '—'}</td>
                  <td className="p-4 text-ember font-display font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-0.5 ${p.published ? 'bg-green-900/30 text-green-400' : 'bg-coal-800 text-coal-400'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 ${p.available ? 'bg-blue-900/30 text-blue-400' : 'bg-red-900/30 text-red-400'}`}>
                        {p.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/products/${p.slug}`} target="_blank" className="text-coal-400 hover:text-white text-xs transition-colors">View</Link>
                      <Link href={`/admin/products/${p.id}/edit`} className="text-ember hover:underline text-xs">Edit</Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-coal-500">No products yet. <Link href="/admin/products/new" className="text-ember hover:underline">Add one.</Link></div>
          )}
        </div>
      </div>
    </div>
  )
}
