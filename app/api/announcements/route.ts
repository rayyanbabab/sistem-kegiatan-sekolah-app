import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/announcements
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '20')

  const announcements = await prisma.announcement.findMany({
    where: {
      ...(type ? { type: type as any } : {}),
    },
    include: {
      creator: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return ok(announcements)
}

// POST /api/announcements — Buat pengumuman baru
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    title: string
    description: string
    type: string
    image?: string
  }>(req)
  if (bodyErr) return bodyErr

  const { title, description, type, image } = data!

  if (!title || !description || !type) {
    return err('title, description, dan type wajib diisi')
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      description,
      type: type as any,
      image: image || null,
      createdBy: session!.userId,
    },
    include: {
      creator: { select: { id: true, name: true } },
    },
  })

  return ok(announcement, 201)
}
