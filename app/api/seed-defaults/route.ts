import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, requireAuth } from '@/lib/apiHelper'

// POST /api/seed-defaults — Seed data awal (SUPER_ADMIN only)
export async function POST(_req: NextRequest) {
  const { error } = await requireAuth(['SUPER_ADMIN'])
  if (error) return error

  const results: string[] = []

  // ── 1. Kategori Lomba Default ──────────────────────────────
  const defaultCategories = [
    { name: 'Olahraga', icon: '⚽', color: 'blue' },
    { name: 'Akademik',  icon: '📚', color: 'violet' },
    { name: 'Seni',      icon: '🎨', color: 'amber' },
  ]

  for (const cat of defaultCategories) {
    const existing = await prisma.competitionCategoryLabel.findUnique({ where: { name: cat.name } })
    if (!existing) {
      await prisma.competitionCategoryLabel.create({ data: cat })
      results.push(`✅ Kategori "${cat.name}" dibuat`)
    } else {
      results.push(`⏭️ Kategori "${cat.name}" sudah ada`)
    }
  }

  // ── 2. Migrasi kategori lama (uppercase enum → title case) ─
  const migrations = [
    { old: 'OLAHRAGA', newName: 'Olahraga' },
    { old: 'AKADEMIK',  newName: 'Akademik' },
    { old: 'SENI',      newName: 'Seni' },
  ]

  for (const m of migrations) {
    const count = await prisma.competition.updateMany({
      where: { category: m.old },
      data:  { category: m.newName },
    })
    if (count.count > 0) {
      results.push(`🔄 Migrasi ${count.count} kompetisi: "${m.old}" → "${m.newName}"`)
    }
  }

  // ── 3. Kelas Default ────────────────────────────────────────
  const defaultKelas = [
    { name: 'X IPA 1',   tingkat: 'X',   jurusan: 'IPA' },
    { name: 'X IPA 2',   tingkat: 'X',   jurusan: 'IPA' },
    { name: 'X IPA 3',   tingkat: 'X',   jurusan: 'IPA' },
    { name: 'X IPS 1',   tingkat: 'X',   jurusan: 'IPS' },
    { name: 'X IPS 2',   tingkat: 'X',   jurusan: 'IPS' },
    { name: 'X RPL 1',   tingkat: 'X',   jurusan: 'RPL' },
    { name: 'XI IPA 1',  tingkat: 'XI',  jurusan: 'IPA' },
    { name: 'XI IPA 2',  tingkat: 'XI',  jurusan: 'IPA' },
    { name: 'XI IPA 3',  tingkat: 'XI',  jurusan: 'IPA' },
    { name: 'XI IPS 1',  tingkat: 'XI',  jurusan: 'IPS' },
    { name: 'XI IPS 2',  tingkat: 'XI',  jurusan: 'IPS' },
    { name: 'XI RPL 1',  tingkat: 'XI',  jurusan: 'RPL' },
    { name: 'XII IPA 1', tingkat: 'XII', jurusan: 'IPA' },
    { name: 'XII IPA 2', tingkat: 'XII', jurusan: 'IPA' },
    { name: 'XII IPA 3', tingkat: 'XII', jurusan: 'IPA' },
    { name: 'XII IPS 1', tingkat: 'XII', jurusan: 'IPS' },
    { name: 'XII IPS 2', tingkat: 'XII', jurusan: 'IPS' },
    { name: 'XII RPL 1', tingkat: 'XII', jurusan: 'RPL' },
  ]

  for (const kelas of defaultKelas) {
    const existing = await prisma.kelas.findUnique({ where: { name: kelas.name } })
    if (!existing) {
      await prisma.kelas.create({ data: kelas })
      results.push(`✅ Kelas "${kelas.name}" dibuat`)
    } else {
      results.push(`⏭️ Kelas "${kelas.name}" sudah ada`)
    }
  }

  // ── 4. School Settings default ─────────────────────────────
  const existingSettings = await prisma.schoolSettings.findFirst()
  if (!existingSettings) {
    await prisma.schoolSettings.create({
      data: { schoolName: 'SMKS Digital', logo: null, updatedAt: new Date() }
    })
    results.push('✅ School settings default dibuat')
  } else {
    results.push('⏭️ School settings sudah ada')
  }

  return ok({ message: 'Seeding selesai!', results })
}
