import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, COOKIE_NAME_EXPORT } from '@/lib/auth'
import { ok, err, parseBody } from '@/lib/apiHelper'

interface LoginBody {
  nis: string
  password: string
}

export async function POST(req: NextRequest) {
  const { data, error } = await parseBody<LoginBody>(req)
  if (error) return error

  const { nis, password } = data!

  if (!nis || !password) {
    return err('NIS dan password wajib diisi')
  }

  const user = await prisma.user.findUnique({ where: { nis } })

  if (!user) {
    return err('NIS atau password salah', 401)
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return err('NIS atau password salah', 401)
  }

  const token = signToken({ userId: user.id, nis: user.nis, role: user.role })

  const response = ok({
    user: {
      id: user.id,
      nis: user.nis,
      name: user.name,
      role: user.role,
      kelas: user.kelas,
      avatar: user.avatar,
    },
  })

  response.cookies.set(COOKIE_NAME_EXPORT, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
