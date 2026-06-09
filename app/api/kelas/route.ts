import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/kelas — List semua kelas (semua user bisa akses)
export async function GET() {
  const kelas = await prisma.kelas.findMany({
    orderBy: [{ tingkat: 'asc' }, { name: 'asc' }],
  })
  return ok(kelas)
}

// POST /api/kelas — Tambah kelas baru (SUPER_ADMIN only)
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    name: string
    tingkat: string
    jurusan: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, tingkat, jurusan } = data!

  if (!name || !tingkat || !jurusan) {
    return err('Nama, tingkat, dan jurusan wajib diisi')
  }

  const existing = await prisma.kelas.findUnique({ where: { name } })
  if (existing) return err('Kelas dengan nama tersebut sudah ada', 409)

  const kelas = await prisma.kelas.create({
    data: { name, tingkat, jurusan },
  })

  return ok(kelas, 201)
}
