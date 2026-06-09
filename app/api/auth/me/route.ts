import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth } from '@/lib/apiHelper'

export async function GET() {
  const { error, session } = await requireAuth()
  if (error) return error

  const user = await prisma.user.findUnique({
    where: { id: session!.userId },
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
