import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Edit Product – Admin' }

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ])
  if (!product) notFound()
  return (
    <div className="lg:pt-0 pt-14">
      <h1 className="font-display font-bold text-3xl text-white mb-8">Edit: {product.name}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  )
}
