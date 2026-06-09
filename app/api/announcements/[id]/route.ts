import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/announcements/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true } },
    },
  })

  if (!announcement) return err('Pengumuman tidak ditemukan', 404)
  return ok(announcement)
}

// PUT /api/announcements/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  const { data, error: bodyErr } = await parseBody<{
    title?: string
    description?: string
    type?: string
    image?: string
  }>(req)
  if (bodyErr) return bodyErr

  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      ...(data!.title ? { title: data!.title } : {}),
      ...(data!.description ? { description: data!.description } : {}),
      ...(data!.type ? { type: data!.type as any } : {}),
      ...(data!.image !== undefined ? { image: data!.image } : {}),
    },
    include: {
      creator: { select: { id: true, name: true } },
    },
  })

  return ok(announcement)
}

// DELETE /api/announcements/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  await prisma.announcement.delete({ where: { id } })
  return ok({ message: 'Pengumuman berhasil dihapus' })
}
