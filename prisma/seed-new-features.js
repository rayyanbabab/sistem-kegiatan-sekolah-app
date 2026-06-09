/**
 * Seed script untuk menambahkan data awal:
 * - Kategori lomba default (Olahraga, Akademik, Seni)
 * - Kelas default (contoh struktur kelas sekolah)
 * - Migrasi data kompetisi lama (OLAHRAGA/AKADEMIK/SENI → nama baru)
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding kategori lomba dan kelas...')

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
      console.log(`  ✅ Kategori "${cat.name}" dibuat`)
    } else {
      console.log(`  ⏭️  Kategori "${cat.name}" sudah ada`)
    }
  }

  // ── 2. Migrasi nama kategori kompetisi lama ────────────────
  // Dari uppercase enum → nama baru dengan huruf kapital
  const categoryMapping = {
    'OLAHRAGA': 'Olahraga',
    'AKADEMIK':  'Akademik',
    'SENI':      'Seni',
  }

  for (const [oldName, newName] of Object.entries(categoryMapping)) {
    const count = await prisma.competition.updateMany({
      where: { category: oldName },
      data:  { category: newName },
    })
    if (count.count > 0) {
      console.log(`  🔄 Migrasi ${count.count} kompetisi: "${oldName}" → "${newName}"`)
    }
  }

  // ── 3. Kelas Default ────────────────────────────────────────
  const defaultKelas = [
    // Tingkat X
    { name: 'X IPA 1',   tingkat: 'X',   jurusan: 'IPA' },
    { name: 'X IPA 2',   tingkat: 'X',   jurusan: 'IPA' },
    { name: 'X IPA 3',   tingkat: 'X',   jurusan: 'IPA' },
    { name: 'X IPS 1',   tingkat: 'X',   jurusan: 'IPS' },
    { name: 'X IPS 2',   tingkat: 'X',   jurusan: 'IPS' },
    { name: 'X RPL 1',   tingkat: 'X',   jurusan: 'RPL' },
    // Tingkat XI
    { name: 'XI IPA 1',  tingkat: 'XI',  jurusan: 'IPA' },
    { name: 'XI IPA 2',  tingkat: 'XI',  jurusan: 'IPA' },
    { name: 'XI IPA 3',  tingkat: 'XI',  jurusan: 'IPA' },
    { name: 'XI IPS 1',  tingkat: 'XI',  jurusan: 'IPS' },
    { name: 'XI IPS 2',  tingkat: 'XI',  jurusan: 'IPS' },
    { name: 'XI RPL 1',  tingkat: 'XI',  jurusan: 'RPL' },
    // Tingkat XII
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
      console.log(`  ✅ Kelas "${kelas.name}" dibuat`)
    } else {
      console.log(`  ⏭️  Kelas "${kelas.name}" sudah ada`)
    }
  }

  // ── 4. School Settings default ─────────────────────────────
  const existingSettings = await prisma.schoolSettings.findFirst()
  if (!existingSettings) {
    await prisma.schoolSettings.create({
      data: { schoolName: 'SMKS Digital', logo: null, updatedAt: new Date() }
    })
    console.log('  ✅ School settings default dibuat')
  } else {
    console.log('  ⏭️  School settings sudah ada')
  }

  console.log('\n✨ Seeding selesai!')
}

main()
  .catch(e => { console.error('❌ Error seeding:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
