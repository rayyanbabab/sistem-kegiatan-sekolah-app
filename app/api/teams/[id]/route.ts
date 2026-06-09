import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// GET /api/teams/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      competition: { select: { id: true, name: true, category: true, date: true, location: true } },
      members: true,
      registrar: { select: { id: true, name: true, kelas: true } },
      results: true,
    },
  })

  if (!team) return err('Tim tidak ditemukan', 404)
  return ok(team)
}

// PUT /api/teams/[id] — Update tim (nama, anggota) atau status verifikasi
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth()
  if (error) return error

  const { id } = await params
  const { data, error: bodyErr } = await parseBody<{
    name?: string
    status?: string
    members?: { name: string; userId?: string }[]
  }>(req)
  if (bodyErr) return bodyErr

  // Hanya panitia/admin bisa ubah status
  if (data!.status && !['SUPER_ADMIN', 'PANITIA'].includes(session!.role)) {
    return err('Hanya panitia yang dapat mengubah status tim', 403)
  }

  const updateData: any = {}
  if (data!.name) updateData.name = data!.name
  if (data!.status) updateData.status = data!.status

  // Jika ada update members, hapus lama dan buat baru
  if (data!.members?.length) {
    await prisma.teamMember.deleteMany({ where: { teamId: id } })
    await prisma.teamMember.createMany({
      data: data!.members.map((m) => ({
        teamId: id,
        name: m.name,
        userId: m.userId || null,
      })),
    })
  }

  const team = await prisma.team.update({
    where: { id },
    data: updateData,
    include: { members: true },
  })

  return ok(team)
}

// DELETE /api/teams/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth()
  if (error) return error

  const { id } = await params
  const team = await prisma.team.findUnique({ where: { id } })
  if (!team) return err('Tim tidak ditemukan', 404)

  // Hanya registrar atau admin/panitia yang bisa hapus
  if (
    session!.userId !== team.registeredBy &&
    !['SUPER_ADMIN', 'PANITIA'].includes(session!.role)
  ) {
    return err('Forbidden', 403)
  }

  await prisma.team.delete({ where: { id } })
  return ok({ message: 'Tim berhasil dihapus' })
}

// PATCH /api/teams/[id] — Shorthand untuk update status (approve/reject)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAuth(['SUPER_ADMIN', 'PANITIA'])
  if (error) return error

  const { id } = await params
  const { data, error: bodyErr } = await parseBody<{ status: string }>(req)
  if (bodyErr) return bodyErr

  const allowed = ['APPROVED', 'REJECTED', 'REGISTERED']
  if (!data!.status || !allowed.includes(data!.status)) {
    return err('Status tidak valid. Gunakan: APPROVED, REJECTED, atau REGISTERED')
  }

  const team = await prisma.team.update({
    where: { id },
    data: { status: data!.status as any },
    include: {
      competition: { select: { id: true, name: true } },
      members: true,
      registrar: { select: { id: true, name: true } },
    },
  })

  return ok(team)
}

