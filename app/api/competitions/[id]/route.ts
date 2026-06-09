import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/competitions/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const competition = await prisma.competition.findUnique({
    where: { id },
    include: {
      event: { select: { id: true, name: true } },
      _count: { select: { teams: true } },
      teams: {
        include: { members: true },
        orderBy: { createdAt: 'desc' },
      },
      results: {
        include: {
          team: { select: { id: true, name: true, kelas: true } },
        },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!competition) return err('Kompetisi tidak ditemukan', 404)
  return ok(competition)
}

// PUT /api/competitions/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  const { data, error: bodyErr } = await parseBody<{
    name?: string
    date?: string
    time?: string
    location?: string
    category?: string
  }>(req)
  if (bodyErr) return bodyErr

  const competition = await prisma.competition.update({
    where: { id },
    data: {
      ...(data!.name ? { name: data!.name } : {}),
      ...(data!.date ? { date: new Date(data!.date) } : {}),
      ...(data!.time ? { time: data!.time } : {}),
      ...(data!.location ? { location: data!.location } : {}),
      ...(data!.category ? { category: data!.category as any } : {}),
    },
  })

  return ok(competition)
}

// DELETE /api/competitions/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  await prisma.competition.delete({ where: { id } })
  return ok({ message: 'Kompetisi berhasil dihapus' })
}
