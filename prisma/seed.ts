import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const DATABASE_URL = "postgresql://neondb_owner:npg_ez8FGpiU7qwm@ep-bitter-haze-ao63rnn3-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({ connectionString: DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('🌱 Mulai seeding database...')

  // ============================================================
  // BERSIHKAN DATA LAMA
  // ============================================================
  await prisma.vote.deleteMany()
  await prisma.votingSession.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.competitionResult.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.competition.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Data lama dibersihkan')

  // ============================================================
  // USERS
  // ============================================================
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      nis: '00000001',
      name: 'Admin Sekolah',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      kelas: null,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  })

  const panitia = await prisma.user.create({
    data: {
      nis: '00000002',
      name: 'Panitia OSIS',
      password: hashedPassword,
      role: 'PANITIA',
      kelas: 'XII IPA 1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=panitia',
    },
  })

  const ketuaKelas = await prisma.user.create({
    data: {
      nis: '20240001',
      name: 'Ketua Kelas XI IPA 2',
      password: hashedPassword,
      role: 'KETUA_KELAS',
      kelas: 'XI IPA 2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ketua',
    },
  })

  const siswa1 = await prisma.user.create({
    data: {
      nis: '20240002',
      name: 'Ahmad Ridho',
      password: hashedPassword,
      role: 'SISWA',
      kelas: 'XI IPA 2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    },
  })

  const siswa2 = await prisma.user.create({
    data: {
      nis: '20240003',
      name: 'Dina Putri',
      password: hashedPassword,
      role: 'SISWA',
      kelas: 'XI IPS 1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dina',
    },
  })

  const kandidat1User = await prisma.user.create({
    data: {
      nis: '20230001',
      name: 'Siti Nurhaliza',
      password: hashedPassword,
      role: 'KANDIDAT',
      kelas: 'XII IPA 1',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    },
  })

  const kandidat2User = await prisma.user.create({
    data: {
      nis: '20230002',
      name: 'Budi Santoso',
      password: hashedPassword,
      role: 'KANDIDAT',
      kelas: 'XII IPS 2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    },
  })

  const kandidat3User = await prisma.user.create({
    data: {
      nis: '20230003',
      name: 'Rina Puspita',
      password: hashedPassword,
      role: 'KANDIDAT',
      kelas: 'XII IPA 2',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    },
  })

  const kandidat4User = await prisma.user.create({
    data: {
      nis: '20230004',
      name: 'Hendra Wijaya',
      password: hashedPassword,
      role: 'KANDIDAT',
      kelas: 'XII IPA 3',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    },
  })

  console.log('✅ Users dibuat (9 users)')

  // ============================================================
  // EVENTS
  // ============================================================
  const classmeetingEvent = await prisma.event.create({
    data: {
      name: 'Classmeeting 2026',
      description: 'Kompetisi antar kelas untuk menampilkan bakat dan seni siswa',
      date: new Date('2026-07-15'),
      banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
      status: 'ACTIVE',
      type: 'CLASSMEETING',
      createdBy: admin.id,
    },
  })

  const pemiluEvent = await prisma.event.create({
    data: {
      name: 'Pemilu OSIS 2026',
      description: 'Pemilihan Organisasi Siswa Intra Sekolah 2026',
      date: new Date('2026-06-20'),
      banner: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&h=400&fit=crop',
      status: 'ACTIVE',
      type: 'PEMILU',
      createdBy: admin.id,
    },
  })

  const mplsEvent = await prisma.event.create({
    data: {
      name: 'MPLS 2027',
      description: 'Masa Pengenalan Lingkungan Sekolah untuk siswa baru',
      date: new Date('2027-07-01'),
      banner: 'https://images.unsplash.com/photo-1427504494785-cdbe4e1d09b6?w=800&h=400&fit=crop',
      status: 'UPCOMING',
      type: 'MPLS',
      createdBy: admin.id,
    },
  })

  const pentasSeniEvent = await prisma.event.create({
    data: {
      name: 'Pentas Seni 2026',
      description: 'Pameran seni dan budaya siswa',
      date: new Date('2026-09-10'),
      banner: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop',
      status: 'UPCOMING',
      type: 'PENTAS_SENI',
      createdBy: admin.id,
    },
  })

  const lombaKemerdekaan = await prisma.event.create({
    data: {
      name: 'Lomba Kemerdekaan 2026',
      description: 'Berbagai lomba dalam rangka memperingati hari kemerdekaan',
      date: new Date('2026-08-17'),
      banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
      status: 'UPCOMING',
      type: 'LOMBA_KEMERDEKAAN',
      createdBy: admin.id,
    },
  })

  console.log('✅ Events dibuat (5 events)')

  // ============================================================
  // COMPETITIONS (Classmeeting)
  // ============================================================
  const futsalComp = await prisma.competition.create({
    data: {
      name: 'Futsal Putra',
      date: new Date('2026-07-20'),
      time: '08:00',
      location: 'Lapangan Indoor',
      category: 'OLAHRAGA',
      eventId: classmeetingEvent.id,
    },
  })

  const vollyComp = await prisma.competition.create({
    data: {
      name: 'Volly Putri',
      date: new Date('2026-07-21'),
      time: '10:00',
      location: 'Lapangan Sekolah',
      category: 'OLAHRAGA',
      eventId: classmeetingEvent.id,
    },
  })

  const debatComp = await prisma.competition.create({
    data: {
      name: 'Debat Bahasa Indonesia',
      date: new Date('2026-07-22'),
      time: '14:00',
      location: 'Aula Sekolah',
      category: 'AKADEMIK',
      eventId: classmeetingEvent.id,
    },
  })

  const tariComp = await prisma.competition.create({
    data: {
      name: 'Tari Tradisional',
      date: new Date('2026-07-23'),
      time: '15:00',
      location: 'Panggung Utama',
      category: 'SENI',
      eventId: classmeetingEvent.id,
    },
  })

  console.log('✅ Competitions dibuat (4 kompetisi)')

  // ============================================================
  // TEAMS
  // ============================================================
  const team1 = await prisma.team.create({
    data: {
      name: 'XI IPA 2 Futsal',
      kelas: 'XI IPA 2',
      competitionId: futsalComp.id,
      registeredBy: ketuaKelas.id,
      status: 'APPROVED',
      members: {
        create: [
          { name: 'Ahmad Ridho', userId: siswa1.id },
          { name: 'Reza Pratama' },
          { name: 'Dani Setiawan' },
          { name: 'Fajar Nugraha' },
          { name: 'Iqbal Hakim' },
        ],
      },
    },
  })

  const team2 = await prisma.team.create({
    data: {
      name: 'XI IPS 1 Volly',
      kelas: 'XI IPS 1',
      competitionId: vollyComp.id,
      registeredBy: ketuaKelas.id,
      status: 'APPROVED',
      members: {
        create: [
          { name: 'Dina Putri', userId: siswa2.id },
          { name: 'Siti Nur' },
          { name: 'Eka Sari' },
          { name: 'Fiona Wijaya' },
          { name: 'Gita Kusuma' },
        ],
      },
    },
  })

  const team3 = await prisma.team.create({
    data: {
      name: 'XI IPA 1 Debat',
      kelas: 'XI IPA 1',
      competitionId: debatComp.id,
      registeredBy: ketuaKelas.id,
      status: 'REGISTERED',
      members: {
        create: [
          { name: 'Budi Santoso' },
          { name: 'Hendra Wijaya' },
        ],
      },
    },
  })

  console.log('✅ Teams dibuat (3 tim)')

  // ============================================================
  // CANDIDATES (Pemilu OSIS)
  // ============================================================
  await prisma.candidate.create({
    data: {
      number: 1,
      userId: kandidat1User.id,
      visiMisi: 'Menciptakan OSIS yang lebih inklusif dan responsif terhadap kebutuhan siswa. Fokus pada peningkatan program akademik dan non-akademik.',
      campaignVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
      eventId: pemiluEvent.id,
    },
  })

  await prisma.candidate.create({
    data: {
      number: 2,
      userId: kandidat2User.id,
      visiMisi: 'Membangun OSIS yang kuat dalam mengorganisir kegiatan sekolah. Meningkatkan partisipasi siswa dalam setiap program.',
      campaignVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
      eventId: pemiluEvent.id,
    },
  })

  await prisma.candidate.create({
    data: {
      number: 3,
      userId: kandidat3User.id,
      visiMisi: 'OSIS yang transparan dan akuntabel. Mewujudkan program-program yang bermanfaat bagi seluruh siswa.',
      campaignVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
      eventId: pemiluEvent.id,
    },
  })

  await prisma.candidate.create({
    data: {
      number: 4,
      userId: kandidat4User.id,
      visiMisi: 'Memajukan semangat gotong royong dan kebersamaan di sekolah. OSIS yang dekat dengan siswa.',
      campaignVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
      eventId: pemiluEvent.id,
    },
  })

  console.log('✅ Candidates dibuat (4 kandidat)')

  // ============================================================
  // VOTING SESSION
  // ============================================================
  await prisma.votingSession.create({
    data: {
      eventId: pemiluEvent.id,
      status: 'OPEN',
      startTime: new Date('2026-06-20T08:00:00'),
      endTime: new Date('2026-06-20T15:00:00'),
      totalVoters: 450,
    },
  })

  console.log('✅ Voting session dibuat')

  // ============================================================
  // ANNOUNCEMENTS
  // ============================================================
  await prisma.announcement.create({
    data: {
      title: 'Pembukaan Pendaftaran Classmeeting 2026',
      description: 'Pendaftaran Classmeeting 2026 sudah dibuka. Setiap kelas dapat mendaftarkan tim untuk berbagai kategori lomba. Batas pendaftaran 10 Juli 2026.',
      type: 'LOMBA',
      createdBy: panitia.id,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'Jadwal Voting Pemilu OSIS',
      description: 'Voting Pemilu OSIS akan dilaksanakan pada tanggal 20 Juni 2026 pukul 08:00 - 15:00 di setiap kelas. Pastikan semua siswa berpartisipasi!',
      type: 'PEMILU',
      createdBy: panitia.id,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'Pengumuman Juara Classmeeting 2025',
      description: 'Berikut adalah daftar juara-juara dari setiap kategori dalam Classmeeting 2025. Selamat kepada semua pemenang!',
      type: 'JUARA',
      createdBy: admin.id,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'Selamat Datang Tahun Ajaran 2026/2027',
      description: 'OSIS mengucapkan selamat datang kepada seluruh siswa baru di tahun ajaran 2026/2027. Banyak kegiatan seru yang menanti!',
      type: 'SEKOLAH',
      createdBy: admin.id,
    },
  })

  console.log('✅ Announcements dibuat (4 pengumuman)')

  // ============================================================
  // COMPETITION RESULTS (Leaderboard)
  // ============================================================
  await prisma.competitionResult.create({
    data: {
      competitionId: futsalComp.id,
      teamId: team1.id,
      position: 1,
      points: 100,
      medal: 'GOLD',
    },
  })

  await prisma.competitionResult.create({
    data: {
      competitionId: vollyComp.id,
      teamId: team2.id,
      position: 1,
      points: 100,
      medal: 'GOLD',
    },
  })

  console.log('✅ Competition results dibuat')

  console.log('\n🎉 Seeding selesai!')
  console.log('\n📋 Akun yang bisa digunakan:')
  console.log('  Super Admin  → NIS: 00000001, Password: password123')
  console.log('  Panitia      → NIS: 00000002, Password: password123')
  console.log('  Ketua Kelas  → NIS: 20240001, Password: password123')
  console.log('  Siswa        → NIS: 20240002, Password: password123')
  console.log('  Kandidat 1   → NIS: 20230001, Password: password123')
  console.log('  Kandidat 2   → NIS: 20230002, Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
