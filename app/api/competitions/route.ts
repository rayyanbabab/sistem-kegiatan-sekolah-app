import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/competitions
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')
  const category = searchParams.get('category')

  const competitions = await prisma.competition.findMany({
    where: {
      ...(eventId ? { eventId } : {}),
      ...(category ? { category: category as any } : {}),
    },
    include: {
      event: { select: { id: true, name: true } },
      _count: { select: { teams: true, results: true } },
    },
    orderBy: { date: 'asc' },
  })

  return ok(competitions)
}

// POST /api/competitions
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    name: string
    date: string
    time: string
    location: string
    category: string
    eventId: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, date, time, location, category, eventId } = data!

  if (!name || !date || !time || !location || !category || !eventId) {
    return err('Semua field wajib diisi')
  }

  const competition = await prisma.competition.create({
    data: {
      name,
      date: new Date(date),
      time,
      location,
      category: category as any,
      eventId,
    },
  })

  return ok(competition, 201)
}
