import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/users/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth()
  if (error) return error

  const { id } = await params

  // User hanya bisa lihat profile sendiri, admin bisa lihat semua
  if (session!.role !== 'SUPER_ADMIN' && session!.role !== 'PANITIA' && session!.userId !== id) {
    return err('Forbidden', 403)
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nis: true,
      name: true,
      role: true,
      kelas: true,
      avatar: true,
      createdAt: true,
    },
  })

  if (!user) return err('User tidak ditemukan', 404)
  return ok(user)
}

// PUT /api/users/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth()
  if (error) return error

  const { id } = await params

  // User hanya bisa update dirinya sendiri, admin bisa update semua
  if (session!.role !== 'SUPER_ADMIN' && session!.userId !== id) {
    return err('Forbidden', 403)
  }

  const { data, error: bodyErr } = await parseBody<{
    name?: string
    password?: string
    kelas?: string
    avatar?: string
    role?: string
  }>(req)
  if (bodyErr) return bodyErr

  const { name, password, kelas, avatar, role } = data!

  const updateData: any = {}
  if (name) updateData.name = name
  if (kelas !== undefined) updateData.kelas = kelas
  if (avatar !== undefined) updateData.avatar = avatar
  if (password) updateData.password = await bcrypt.hash(password, 10)
  if (role && session!.role === 'SUPER_ADMIN') updateData.role = role

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      nis: true,
      name: true,
      role: true,
      kelas: true,
      avatar: true,
      updatedAt: true,
    },
  })

  return ok(user)
}

// DELETE /api/users/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { id } = await params

  if (session!.userId === id) {
    return err('Tidak bisa menghapus akun sendiri')
  }

  await prisma.user.delete({ where: { id } })
  return ok({ message: 'User berhasil dihapus' })
}
