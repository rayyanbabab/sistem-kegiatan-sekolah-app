import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/users — List semua user (admin only)
export async function GET(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')
  const kelas = searchParams.get('kelas')

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role: role as any } : {}),
      ...(kelas ? { kelas } : {}),
    },
    select: {
      id: true,
      nis: true,
      name: true,
      role: true,
      kelas: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return ok(users)
}

// POST /api/users — Buat user baru (admin only)
export async function POST(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    nis: string
    name: string
    password: string
    role: string
    kelas?: string
    avatar?: string
  }>(req)
  if (bodyErr) return bodyErr

  const { nis, name, password, role, kelas, avatar } = data!

  if (!nis || !name || !password || !role) {
    return err('NIS, nama, password, dan role wajib diisi')
  }

  const existing = await prisma.user.findUnique({ where: { nis } })
  if (existing) return err('NIS sudah terdaftar', 409)

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      nis,
      name,
      password: hashedPassword,
      role: role as any,
      kelas: kelas || null,
      avatar: avatar || null,
    },
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

  return ok(user, 201)
}
