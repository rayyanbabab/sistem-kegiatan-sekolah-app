import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// PUT /api/categories/[id] — Edit kategori
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params

  const { data, error: bodyErr } = await parseBody<{
    name?: string
    icon?: string
    color?: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, icon, color } = data!

  if (!name) return err('Nama kategori wajib diisi')

  // Cek duplikat nama (kecuali dirinya sendiri)
  const existing = await prisma.competitionCategoryLabel.findFirst({
    where: { name, NOT: { id } },
  })
  if (existing) return err('Kategori dengan nama tersebut sudah ada', 409)

  const category = await prisma.competitionCategoryLabel.update({
    where: { id },
    data: {
      name,
      ...(icon !== undefined ? { icon } : {}),
      ...(color !== undefined ? { color } : {}),
    },
  })

  return ok(category)
}

// DELETE /api/categories/[id] — Hapus kategori
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params

  const cat = await prisma.competitionCategoryLabel.findUnique({ where: { id } })
  if (!cat) return err('Kategori tidak ditemukan', 404)

  // Cek apakah ada kompetisi yang pakai kategori ini
  const compCount = await prisma.competition.count({
    where: { category: cat.name },
  })
  if (compCount > 0) {
    return err(`Tidak bisa hapus — ${compCount} kompetisi masih menggunakan kategori ini`, 409)
  }

  await prisma.competitionCategoryLabel.delete({ where: { id } })
  return ok({ message: 'Kategori berhasil dihapus' })
}
