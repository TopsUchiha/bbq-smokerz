import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { toSlug } from '@/lib/utils'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session && (session.user as { role: string }).role === 'admin' ? session : null
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (body.name !== undefined) { data.name = body.name.trim(); data.slug = toSlug(body.name) }
  if (body.active !== undefined) data.active = body.active
  if (body.order !== undefined) data.order = body.order
  const category = await prisma.category.update({ where: { id: params.id }, data })
  return NextResponse.json(category)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.category.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
