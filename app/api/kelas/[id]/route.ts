import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// PUT /api/kelas/[id] — Edit kelas
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { id } = await params

  const { data, error: bodyErr } = await parseBody<{
    name?: string
    tingkat?: string
    jurusan?: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, tingkat, jurusan } = data!

  if (!name || !tingkat || !jurusan) {
    return err('Nama, tingkat, dan jurusan wajib diisi')
  }

  // Cek duplikat nama (kecuali dirinya sendiri)
  const existing = await prisma.kelas.findFirst({
    where: { name, NOT: { id } },
  })
  if (existing) return err('Kelas dengan nama tersebut sudah ada', 409)

  const kelas = await prisma.kelas.update({
    where: { id },
    data: { name, tingkat, jurusan },
  })

  return ok(kelas)
}

// DELETE /api/kelas/[id] — Hapus kelas
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { id } = await params

  const kelas = await prisma.kelas.findUnique({ where: { id } })
  if (!kelas) return err('Kelas tidak ditemukan', 404)

  // Cek apakah ada user yang pakai kelas ini
  const userCount = await prisma.user.count({
    where: { kelas: kelas.name },
  })
  if (userCount > 0) {
    return err(`Tidak bisa hapus — ${userCount} user masih menggunakan kelas ini`, 409)
  }

  await prisma.kelas.delete({ where: { id } })
  return ok({ message: 'Kelas berhasil dihapus' })
}
