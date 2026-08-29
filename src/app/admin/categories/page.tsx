import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/admin/CategoryManager'

export const metadata = { title: 'Categories – Admin' }

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { products: true } } } })
  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Categories</h1>
      <CategoryManager categories={categories} />
    </div>
  )
}
