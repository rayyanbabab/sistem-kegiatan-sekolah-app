import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/results — Leaderboard & hasil lomba
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const competitionId = searchParams.get('competitionId')
  const eventId = searchParams.get('eventId')

  // Jika ada eventId, hitung poin per kelas (leaderboard)
  if (eventId && !competitionId) {
    const results = await prisma.competitionResult.findMany({
      where: {
        competition: { eventId },
      },
      include: {
        team: { select: { id: true, name: true, kelas: true } },
        competition: { select: { id: true, name: true, category: true } },
      },
    })

    // Agregasi poin per kelas
    const kelasMap: Record<string, {
      kelas: string
      points: number
      medals: { gold: number; silver: number; bronze: number }
    }> = {}

    results.forEach((r) => {
      const kelas = r.team.kelas
      if (!kelasMap[kelas]) {
        kelasMap[kelas] = { kelas, points: 0, medals: { gold: 0, silver: 0, bronze: 0 } }
      }
      kelasMap[kelas].points += r.points
      if (r.medal === 'GOLD') kelasMap[kelas].medals.gold++
      if (r.medal === 'SILVER') kelasMap[kelas].medals.silver++
      if (r.medal === 'BRONZE') kelasMap[kelas].medals.bronze++
    })

    const leaderboard = Object.values(kelasMap)
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ rank: idx + 1, ...item }))

    return ok(leaderboard)
  }

  // Hasil per kompetisi
  const results = await prisma.competitionResult.findMany({
    where: {
      ...(competitionId ? { competitionId } : {}),
    },
    include: {
      team: { select: { id: true, name: true, kelas: true } },
      competition: { select: { id: true, name: true, category: true } },
    },
    orderBy: { position: 'asc' },
  })

  return ok(results)
}

// POST /api/results — Input hasil lomba
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    competitionId: string
    teamId: string
    position: number
    points: number
    medal: string
  }>(req)
  if (bodyErr) return bodyErr

  const { competitionId, teamId, position, points, medal } = data!

  if (!competitionId || !teamId || !position) {
    return err('competitionId, teamId, dan position wajib diisi')
  }

  // Upsert: update jika sudah ada, insert jika belum
  const result = await prisma.competitionResult.upsert({
    where: {
      competitionId_position: { competitionId, position },
    },
    update: {
      teamId,
      points: points || 0,
      medal: (medal as any) || 'NONE',
    },
    create: {
      competitionId,
      teamId,
      position,
      points: points || 0,
      medal: (medal as any) || 'NONE',
    },
    include: {
      team: { select: { id: true, name: true, kelas: true } },
      competition: { select: { id: true, name: true } },
    },
  })

  return ok(result, 201)
}
