import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
  productId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    await prisma.review.create({
      data: {
        name: data.name,
        email: data.email,
        rating: data.rating,
        comment: data.comment,
        productId: data.productId || null,
        approved: false,
      },
    })

    return NextResponse.json({ success: true, message: 'Review submitted. It will appear after approval.' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
