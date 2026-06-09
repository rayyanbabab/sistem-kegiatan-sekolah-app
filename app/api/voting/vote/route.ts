import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, err, requireAuth, parseBody } from '@/lib/apiHelper'

// POST /api/voting/vote — Submit vote
export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth(['SISWA', 'KETUA_KELAS', 'KANDIDAT'])
  if (error) return error

  const { data, error: bodyErr } = await parseBody<{
    candidateId: string
    votingSessionId: string
  }>(req)
  if (bodyErr) return bodyErr

  const { candidateId, votingSessionId } = data!

  if (!candidateId || !votingSessionId) {
    return err('candidateId dan votingSessionId wajib diisi')
  }

  // Cek sesi voting masih terbuka
  const votingSession = await prisma.votingSession.findUnique({
    where: { id: votingSessionId },
  })
  if (!votingSession) return err('Sesi voting tidak ditemukan', 404)
  if (votingSession.status !== 'OPEN') return err('Sesi voting sudah ditutup', 400)

  // Cek waktu voting masih dalam range
  const now = new Date()
  if (now < votingSession.startTime) return err('Voting belum dimulai', 400)
  if (now > votingSession.endTime) return err('Waktu voting sudah habis', 400)

  // Cek apakah user sudah vote
  const existingVote = await prisma.vote.findUnique({
    where: { voterId: session!.userId },
  })
  if (existingVote) return err('Anda sudah memberikan suara', 409)

  // Cek kandidat valid
  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } })
  if (!candidate) return err('Kandidat tidak ditemukan', 404)

  // Simpan vote
  const vote = await prisma.vote.create({
    data: {
      voterId: session!.userId,
      candidateId,
      votingSessionId,
    },
  })

  return ok({ message: 'Vote berhasil disimpan', voteId: vote.id }, 201)
}

// GET /api/voting/vote — Cek apakah user sudah vote
export async function GET() {
  const { error, session } = await requireAuth()
  if (error) return error

  const existingVote = await prisma.vote.findUnique({
    where: { voterId: session!.userId },
    include: {
      candidate: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
  })

  return ok({
    hasVoted: !!existingVote,
    vote: existingVote || null,
  })
}
