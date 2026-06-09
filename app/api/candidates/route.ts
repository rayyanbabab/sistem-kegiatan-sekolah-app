import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/candidates
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')

  const candidates = await prisma.candidate.findMany({
    where: {
      ...(eventId ? { eventId } : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, kelas: true, avatar: true },
      },
      _count: { select: { votes: true } },
    },
    orderBy: { number: 'asc' },
  })

  // Tambahkan jumlah suara ke setiap kandidat
  const result = candidates.map((c) => ({
    ...c,
    votes: c._count.votes,
  }))

  return ok(result)
}

// POST /api/candidates — Tambah kandidat (admin only)
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    number: number
    userId: string
    visiMisi: string
    campaignVideo?: string
    photo?: string
    eventId: string
  }>(req)
  if (bodyErr) return bodyErr

  const { number, userId, visiMisi, campaignVideo, photo, eventId } = data!

  if (!number || !userId || !visiMisi || !eventId) {
    return err('number, userId, visiMisi, dan eventId wajib diisi')
  }

  // Cek user sudah jadi kandidat
  const existing = await prisma.candidate.findFirst({
    where: { OR: [{ userId }, { number, eventId }] },
  })
  if (existing) return err('User sudah menjadi kandidat atau nomor urut sudah dipakai', 409)

  const candidate = await prisma.candidate.create({
    data: {
      number,
      userId,
      visiMisi,
      campaignVideo: campaignVideo || null,
      photo: photo || null,
      eventId,
    },
    include: {
      user: { select: { id: true, name: true, kelas: true, avatar: true } },
    },
  })

  return ok(candidate, 201)
}
