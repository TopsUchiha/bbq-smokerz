import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  categoryId: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  available: z.boolean().optional(),
  published: z.boolean().optional(),
  material: z.string().max(200).nullable().optional(),
  dimensions: z.string().max(200).nullable().optional(),
  weight: z.string().max(100).nullable().optional(),
  features: z.array(z.string()).optional(),
})

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session && (session.user as { role: string }).role === 'admin' ? session : null
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const product = await prisma.product.update({ where: { id: params.id }, data })
    return NextResponse.json(product)
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
