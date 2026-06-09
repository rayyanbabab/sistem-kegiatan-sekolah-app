import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/events — List semua event
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  const events = await prisma.event.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(type ? { type: type as any } : {}),
    },
    include: {
      creator: {
        select: { id: true, name: true },
      },
      _count: {
        select: { competitions: true, candidates: true },
      },
    },
    orderBy: { date: 'asc' },
  })

  return ok(events)
}

// POST /api/events — Buat event baru
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    name: string
    description: string
    date: string
    banner?: string
    status?: string
    type: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, description, date, banner, status, type } = data!

  if (!name || !description || !date || !type) {
    return err('name, description, date, dan type wajib diisi')
  }

  const event = await prisma.event.create({
    data: {
      name,
      description,
      date: new Date(date),
      banner: banner || null,
      status: (status as any) || 'UPCOMING',
      type: type as any,
      createdBy: session!.userId,
    },
  })

  return ok(event, 201)
}
