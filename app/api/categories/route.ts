import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/categories — List semua kategori lomba
export async function GET() {
  const categories = await prisma.competitionCategoryLabel.findMany({
    orderBy: { name: 'asc' },
  })
  return ok(categories)
}

// POST /api/categories — Tambah kategori baru (SUPER_ADMIN/PANITIA)
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    name: string
    icon?: string
    color?: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, icon = '🏅', color = 'blue' } = data!

  if (!name) return err('Nama kategori wajib diisi')

  const existing = await prisma.competitionCategoryLabel.findUnique({ where: { name } })
  if (existing) return err('Kategori dengan nama tersebut sudah ada', 409)

  const category = await prisma.competitionCategoryLabel.create({
    data: { name, icon, color },
  })

  return ok(category, 201)
}
