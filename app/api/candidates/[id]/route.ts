import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/candidates/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, kelas: true, avatar: true } },
      event: { select: { id: true, name: true } },
      _count: { select: { votes: true } },
    },
  })

  if (!candidate) return err('Kandidat tidak ditemukan', 404)
  return ok({ ...candidate, votes: candidate._count.votes })
}

// PUT /api/candidates/[id] — Kandidat update profil sendiri, admin update semua
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth()
  if (error) return error

  const { id } = await params

  const candidate = await prisma.candidate.findUnique({ where: { id } })
  if (!candidate) return err('Kandidat tidak ditemukan', 404)

  // Kandidat hanya bisa update profil sendiri
  if (
    session!.role === 'KANDIDAT' &&
    candidate.userId !== session!.userId
  ) {
    return err('Forbidden', 403)
  }

  if (!['SUPER_ADMIN', 'PANITIA', 'KANDIDAT'].includes(session!.role)) {
    return err('Forbidden', 403)
  }

  const { data, error: bodyErr } = await parseBody<{
    visiMisi?: string
    campaignVideo?: string
    photo?: string
    number?: number
  }>(req)
  if (bodyErr) return bodyErr

  const updateData: any = {}
  if (data!.visiMisi) updateData.visiMisi = data!.visiMisi
  if (data!.campaignVideo !== undefined) updateData.campaignVideo = data!.campaignVideo
  if (data!.photo !== undefined) updateData.photo = data!.photo
  if (data!.number && ['SUPER_ADMIN', 'PANITIA'].includes(session!.role)) {
    updateData.number = data!.number
  }

  const updated = await prisma.candidate.update({
    where: { id },
    data: updateData,
    include: {
      user: { select: { id: true, name: true, kelas: true, avatar: true } },
    },
  })

  return ok(updated)
}

// DELETE /api/candidates/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  await prisma.candidate.delete({ where: { id } })
  return ok({ message: 'Kandidat berhasil dihapus' })
}
