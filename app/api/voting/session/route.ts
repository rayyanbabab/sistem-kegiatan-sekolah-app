import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth } from '@/lib/apiHelper'
import { NextRequest } from 'next/server'

// GET /api/voting/session — Info sesi voting aktif
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')

  const session = await prisma.votingSession.findFirst({
    where: {
      status: 'OPEN',
      ...(eventId ? { eventId } : {}),
    },
    include: {
      event: { select: { id: true, name: true } },
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!session) {
    // Return closed status jika tidak ada sesi aktif
    const lastSession = await prisma.votingSession.findFirst({
      include: { event: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return ok(lastSession || null)
  }

  return ok({
    ...session,
    votedCount: session._count.votes,
  })
}

// POST /api/voting/session — Buat atau update sesi voting (admin/panitia)
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const body = await req.json()
  const { eventId, status, startTime, endTime, totalVoters } = body

  if (!eventId || !startTime || !endTime) {
    return err('eventId, startTime, dan endTime wajib diisi')
  }

  // Tutup sesi yang sedang buka untuk event ini
  await prisma.votingSession.updateMany({
    where: { eventId, status: 'OPEN' },
    data: { status: 'CLOSED' },
  })

  const votingSession = await prisma.votingSession.create({
    data: {
      eventId,
      status: status || 'OPEN',
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      totalVoters: totalVoters || 0,
    },
  })

  return ok(votingSession, 201)
}

// PUT /api/voting/session — Update status sesi (buka/tutup)
export async function PUT(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('id')
  if (!sessionId) return err('id sesi wajib diisi')

  const body = await req.json()
  const { status, totalVoters } = body

  const updated = await prisma.votingSession.update({
    where: { id: sessionId },
    data: {
      ...(status ? { status: status as any } : {}),
      ...(totalVoters !== undefined ? { totalVoters } : {}),
    },
  })

  return ok(updated)
}
