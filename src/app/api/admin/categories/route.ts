import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { toSlug } from '@/lib/utils'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session && (session.user as { role: string }).role === 'admin' ? session : null
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    const slug = toSlug(name)
    const maxOrder = await prisma.category.aggregate({ _max: { order: true } })
    const category = await prisma.category.create({
      data: { name: name.trim(), slug, order: (maxOrder._max.order ?? 0) + 1 },
    })
    return NextResponse.json(category, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
