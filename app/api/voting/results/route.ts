import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok } from '@/lib/apiHelper'

// GET /api/voting/results — Real count hasil voting
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')

  // Ambil semua kandidat dengan jumlah suara
  const candidates = await prisma.candidate.findMany({
    where: {
      ...(eventId ? { eventId } : {}),
    },
    include: {
      user: { select: { id: true, name: true, kelas: true, avatar: true } },
      _count: { select: { votes: true } },
    },
    orderBy: { number: 'asc' },
  })

  // Ambil sesi voting
  const votingSession = await prisma.votingSession.findFirst({
    where: {
      ...(eventId ? { eventId } : {}),
    },
    include: {
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalVotes = votingSession?._count?.votes || 0
  const totalVoters = votingSession?.totalVoters || 0

  const results = candidates.map((c) => ({
    id: c.id,
    number: c.number,
    name: c.user.name,
    kelas: c.user.kelas,
    avatar: c.user.avatar,
    photo: c.photo,
    visiMisi: c.visiMisi,
    votes: c._count.votes,
    percentage: totalVotes > 0 ? Math.round((c._count.votes / totalVotes) * 100) : 0,
  }))

  // Urutkan dari votes terbanyak
  const ranked = [...results].sort((a, b) => b.votes - a.votes)

  return ok({
    candidates: results,
    ranked,
    votingSession: votingSession
      ? {
          id: votingSession.id,
          status: votingSession.status,
          startTime: votingSession.startTime,
          endTime: votingSession.endTime,
          totalVoters,
          votedCount: totalVotes,
          participationRate: totalVoters > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0,
        }
      : null,
  })
}
