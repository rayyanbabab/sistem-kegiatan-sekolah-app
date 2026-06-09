import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/results/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const result = await prisma.competitionResult.findUnique({
    where: { id },
    include: {
      team: { select: { id: true, name: true, kelas: true } },
      competition: { select: { id: true, name: true, category: true } },
    },
  })

  if (!result) return err('Hasil lomba tidak ditemukan', 404)
  return ok(result)
}

// PUT /api/results/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  const { data, error: bodyErr } = await parseBody<{
    teamId?: string
    position?: number
    points?: number
    medal?: string
  }>(req)
  if (bodyErr) return bodyErr

  const result = await prisma.competitionResult.update({
    where: { id },
    data: {
      ...(data!.teamId ? { teamId: data!.teamId } : {}),
      ...(data!.position !== undefined ? { position: data!.position } : {}),
      ...(data!.points !== undefined ? { points: data!.points } : {}),
      ...(data!.medal ? { medal: data!.medal as any } : {}),
    },
    include: {
      team: { select: { id: true, name: true, kelas: true } },
      competition: { select: { id: true, name: true } },
    },
  })

  return ok(result)
}

// DELETE /api/results/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  await prisma.competitionResult.delete({ where: { id } })
  return ok({ message: 'Hasil lomba berhasil dihapus' })
}
