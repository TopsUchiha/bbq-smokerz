import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { toSlug } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  images: z.array(z.string().url()).optional().default([]),
  categoryId: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
  available: z.boolean().optional().default(true),
  published: z.boolean().optional().default(true),
  material: z.string().max(200).optional().default(''),
  dimensions: z.string().max(200).optional().default(''),
  weight: z.string().max(100).optional().default(''),
  features: z.array(z.string()).optional().default([]),
})

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role: string }).role !== 'admin') return null
  return session
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = schema.parse(body)

    let slug = toSlug(data.name)
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const product = await prisma.product.create({
      data: { ...data, slug, categoryId: data.categoryId || null, material: data.material || null, dimensions: data.dimensions || null, weight: data.weight || null },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
