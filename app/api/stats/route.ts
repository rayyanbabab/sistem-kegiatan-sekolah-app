import { prisma } from '@/lib/prisma'
import { ok } from '@/lib/apiHelper'

// GET /api/stats — Statistik dashboard
export async function GET() {
  const [
    totalUsers,
    totalSiswa,
    totalEvents,
    activeEvents,
    totalCompetitions,
    totalTeams,
    approvedTeams,
    totalCandidates,
    totalAnnouncements,
    votingSession,
    totalResults,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'SISWA' } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: 'ACTIVE' } }),
    prisma.competition.count(),
    prisma.team.count(),
    prisma.team.count({ where: { status: 'APPROVED' } }),
    prisma.candidate.count(),
    prisma.announcement.count(),
    prisma.votingSession.findFirst({
      where: { status: 'OPEN' },
      include: { _count: { select: { votes: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.competitionResult.count(),
  ])

  return ok({
    users: {
      total: totalUsers,
      siswa: totalSiswa,
    },
    events: {
      total: totalEvents,
      active: activeEvents,
    },
    competitions: {
      total: totalCompetitions,
    },
    teams: {
      total: totalTeams,
      approved: approvedTeams,
      pending: totalTeams - approvedTeams,
    },
    candidates: {
      total: totalCandidates,
    },
    announcements: {
      total: totalAnnouncements,
    },
    voting: {
      sessionActive: !!votingSession,
      totalVoters: votingSession?.totalVoters || 0,
      votedCount: votingSession?._count?.votes || 0,
      participationRate:
        votingSession && votingSession.totalVoters > 0
          ? Math.round(((votingSession._count?.votes || 0) / votingSession.totalVoters) * 100)
          : 0,
    },
    results: {
      total: totalResults,
    },
  })
}
