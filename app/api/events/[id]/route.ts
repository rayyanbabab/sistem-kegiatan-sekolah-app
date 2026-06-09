import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/events/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true } },
      competitions: { orderBy: { date: 'asc' } },
      candidates: {
        include: {
          user: { select: { id: true, name: true, kelas: true, avatar: true } },
          _count: { select: { votes: true } },
        },
        orderBy: { number: 'asc' },
      },
      votingSessions: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  if (!event) return err('Event tidak ditemukan', 404)
  return ok(event)
}

// PUT /api/events/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  const { data, error: bodyErr } = await parseBody<{
    name?: string
    description?: string
    date?: string
    banner?: string
    status?: string
    type?: string
  }>(req)
  if (bodyErr) return bodyErr

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...(data!.name ? { name: data!.name } : {}),
      ...(data!.description ? { description: data!.description } : {}),
      ...(data!.date ? { date: new Date(data!.date) } : {}),
      ...(data!.banner !== undefined ? { banner: data!.banner } : {}),
      ...(data!.status ? { status: data!.status as any } : {}),
      ...(data!.type ? { type: data!.type as any } : {}),
    },
  })

  return ok(event)
}

// DELETE /api/events/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { id } = await params
  await prisma.event.delete({ where: { id } })
  return ok({ message: 'Event berhasil dihapus' })
}
