import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/teams
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const competitionId = searchParams.get('competitionId')
  const kelas = searchParams.get('kelas')
  const status = searchParams.get('status')

  const teams = await prisma.team.findMany({
    where: {
      ...(competitionId ? { competitionId } : {}),
      ...(kelas ? { kelas } : {}),
      ...(status ? { status: status as any } : {}),
    },
    include: {
      competition: { select: { id: true, name: true, category: true } },
      members: true,
      registrar: { select: { id: true, name: true, kelas: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return ok(teams)
}

// POST /api/teams — Daftarkan tim baru
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['KETUA_KELAS', 'SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    name: string
    kelas: string
    competitionId: string
    members: { name: string; userId?: string }[]
  }>(req)
  if (bodyErr) return bodyErr

  const { name, kelas, competitionId, members } = data!

  if (!name || !kelas || !competitionId || !members?.length) {
    return err('name, kelas, competitionId, dan members wajib diisi')
  }

  // Cek apakah kelas sudah daftar di kompetisi ini
  const existing = await prisma.team.findFirst({
    where: { kelas, competitionId },
  })
  if (existing) return err('Kelas ini sudah terdaftar pada kompetisi tersebut', 409)

  const team = await prisma.team.create({
    data: {
      name,
      kelas,
      competitionId,
      registeredBy: session!.userId,
      members: {
        create: members.map((m) => ({
          name: m.name,
          userId: m.userId || null,
        })),
      },
    },
    include: {
      members: true,
      competition: { select: { id: true, name: true } },
    },
  })

  return ok(team, 201)
}
