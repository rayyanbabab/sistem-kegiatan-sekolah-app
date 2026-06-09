import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/settings — Ambil pengaturan sekolah (semua user)
export async function GET() {
  // Ambil atau buat default settings
  let settings = await prisma.schoolSettings.findFirst()
  if (!settings) {
    settings = await prisma.schoolSettings.create({
      data: {
        schoolName: 'SMKS Digital',
        logo: null,
        updatedAt: new Date(),
      },
    })
  }
  return ok(settings)
}

// PUT /api/settings — Update pengaturan sekolah (SUPER_ADMIN only)
export async function PUT(req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    schoolName?: string
    logo?: string | null
  }>(req)
  if (bodyErr) return bodyErr

  const { schoolName, logo } = data!

  // Validasi ukuran Base64 logo (< 2MB raw = ~1.5MB binary)
  if (logo && logo.length > 2_000_000) {
    return err('Logo terlalu besar. Maksimal ukuran 1.5MB setelah kompresi.')
  }

  let settings = await prisma.schoolSettings.findFirst()

  if (settings) {
    settings = await prisma.schoolSettings.update({
      where: { id: settings.id },
      data: {
        ...(schoolName !== undefined ? { schoolName } : {}),
        ...(logo !== undefined ? { logo } : {}),
        updatedAt: new Date(),
      },
    })
  } else {
    settings = await prisma.schoolSettings.create({
      data: {
        schoolName: schoolName || 'SMKS Digital',
        logo: logo || null,
        updatedAt: new Date(),
      },
    })
  }

  return ok(settings)
}
