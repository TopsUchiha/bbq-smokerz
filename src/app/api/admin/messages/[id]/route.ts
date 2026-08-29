import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session && (session.user as { role: string }).role === 'admin' ? session : null
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { read } = await req.json()
  const msg = await prisma.contactMessage.update({ where: { id: params.id }, data: { read } })
  return NextResponse.json(msg)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.contactMessage.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
