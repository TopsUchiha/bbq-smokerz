import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'New Product – Admin' }

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } })
  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
