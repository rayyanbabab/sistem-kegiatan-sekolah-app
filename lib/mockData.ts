// Mock Data untuk Sistem Manajemen Kegiatan Sekolah
export type Role = 'super-admin' | 'panitia' | 'kandidat' | 'ketua-kelas' | 'siswa'

export interface User {
  id: string
  name: string
  nis: string
  role: Role
  kelas: string
  avatar?: string
}

export interface Candidate {
  id: string
  number: number
  name: string
  kelas: string
  photo: string
  visiMisi: string
  campaignVideo?: string
  votes: number
}

export interface Competition {
  id: string
  name: string
  date: string
  time: string
  location: string
  category: string
}

export interface Team {
  id: string
  name: string
  members: string[]
  competition: string
  status: 'registered' | 'approved' | 'rejected'
}

export interface Event {
  id: string
  name: string
  description: string
  date: string
  banner: string
  status: 'active' | 'upcoming' | 'ended'
  type: 'classmeeting' | 'pemilu' | 'mpls' | 'pentas-seni' | 'lomba-kemerdekaan'
}

export interface Announcement {
  id: string
  title: string
  description: string
  type: 'sekolah' | 'lomba' | 'pemilu' | 'juara'
  date: string
  image?: string
}

export interface VotingSession {
  id: string
  status: 'open' | 'closed'
  startTime: string
  endTime: string
  totalVoters: number
  votedCount: number
}

// Current User - Dynamic based on role selection
export const currentUser: User = {
  id: '1',
  name: 'Ahmad Ridho',
  nis: '12345678',
  role: 'siswa',
  kelas: 'XI IPA 2',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad'
}

// Candidates for Pemilu OSIS
export const candidates: Candidate[] = [
  {
    id: '1',
    number: 1,
    name: 'Siti Nurhaliza',
    kelas: 'XII IPA 1',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    visiMisi: 'Menciptakan OSIS yang lebih inklusif dan responsif terhadap kebutuhan siswa. Fokus pada peningkatan program akademik dan non-akademik.',
    campaignVideo: '#',
    votes: 234
  },
  {
    id: '2',
    number: 2,
    name: 'Budi Santoso',
    kelas: 'XII IPS 2',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    visiMisi: 'Membangun OSIS yang kuat dalam mengorganisir kegiatan sekolah. Meningkatkan partisipasi siswa dalam setiap program.',
    campaignVideo: '#',
    votes: 189
  },
  {
    id: '3',
    number: 3,
    name: 'Rina Puspita',
    kelas: 'XII IPA 2',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    visiMisi: 'OSIS yang transparan dan akuntabel. Mewujudkan program-program yang bermanfaat bagi seluruh siswa.',
    campaignVideo: '#',
    votes: 156
  },
  {
    id: '4',
    number: 4,
    name: 'Hendra Wijaya',
    kelas: 'XII IPA 3',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    visiMisi: 'Memajukan semangat gotong royong dan kebersamaan di sekolah. OSIS yang dekat dengan siswa.',
    campaignVideo: '#',
    votes: 201
  }
]

// Events
export const events: Event[] = [
  {
    id: '1',
    name: 'Classmeeting 2026',
    description: 'Kompetisi antar kelas untuk menampilkan bakat dan seni siswa',
    date: '2026-07-15',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    status: 'active',
    type: 'classmeeting'
  },
  {
    id: '2',
    name: 'Pemilu OSIS 2026',
    description: 'Pemilihan Organisasi Siswa Intra Sekolah 2026',
    date: '2026-06-20',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    status: 'active',
    type: 'pemilu'
  },
  {
    id: '3',
    name: 'MPLS 2027',
    description: 'Masa Pengenalan Lingkungan Sekolah untuk siswa baru',
    date: '2027-07-01',
    banner: 'https://images.unsplash.com/photo-1427504494785-cdbe4e1d09b6?w=800&h=400&fit=crop',
    status: 'upcoming',
    type: 'mpls'
  },
  {
    id: '4',
    name: 'Pentas Seni 2026',
    description: 'Pameran seni dan budaya siswa',
    date: '2026-09-10',
    banner: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop',
    status: 'upcoming',
    type: 'pentas-seni'
  },
  {
    id: '5',
    name: 'Lomba Kemerdekaan 2026',
    description: 'Berbagai lomba dalam rangka memperingati hari kemerdekaan',
    date: '2026-08-17',
    banner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop',
    status: 'upcoming',
    type: 'lomba-kemerdekaan'
  }
]

// Competitions for Classmeeting
export const competitions: Competition[] = [
  {
    id: '1',
    name: 'Futsal Putra',
    date: '2026-07-20',
    time: '08:00',
    location: 'Lapangan Indoor',
    category: 'Olahraga'
  },
  {
    id: '2',
    name: 'Volly Putri',
    date: '2026-07-21',
    time: '10:00',
    location: 'Lapangan Sekolah',
    category: 'Olahraga'
  },
  {
    id: '3',
    name: 'Debat Bahasa Indonesia',
    date: '2026-07-22',
    time: '14:00',
    location: 'Aula Sekolah',
    category: 'Akademik'
  },
  {
    id: '4',
    name: 'Tari Tradisional',
    date: '2026-07-23',
    time: '15:00',
    location: 'Panggung Utama',
    category: 'Seni'
  }
]

// Teams registered for competitions
export const teams: Team[] = [
  {
    id: '1',
    name: 'XI IPA 2 Futsal',
    members: ['Ahmad Ridho', 'Reza Pratama', 'Dani Setiawan', 'Fajar Nugraha', 'Iqbal Hakim'],
    competition: '1',
    status: 'approved'
  },
  {
    id: '2',
    name: 'XI IPS 1 Volly',
    members: ['Siti Nur', 'Dina Putri', 'Eka Sari', 'Fiona Wijaya', 'Gita Kusuma'],
    competition: '2',
    status: 'approved'
  },
  {
    id: '3',
    name: 'XI IPA 1 Debat',
    members: ['Budi Santoso', 'Hendra Wijaya'],
    competition: '3',
    status: 'registered'
  }
]

// Announcements
export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Pembukaan Pendaftaran Classmeeting 2026',
    description: 'Pendaftaran Classmeeting 2026 sudah dibuka. Setiap kelas dapat mendaftarkan tim untuk berbagai kategori lomba.',
    type: 'lomba',
    date: '2026-06-01'
  },
  {
    id: '2',
    title: 'Jadwal Voting Pemilu OSIS',
    description: 'Voting Pemilu OSIS akan dilaksanakan pada tanggal 20 Juni 2026 pukul 08:00 - 15:00 di setiap kelas.',
    type: 'pemilu',
    date: '2026-06-15'
  },
  {
    id: '3',
    title: 'Pengumuman Juara Classmeeting 2025',
    description: 'Berikut adalah daftar juara-juara dari setiap kategori dalam Classmeeting 2025.',
    type: 'juara',
    date: '2025-12-15'
  }
]

// Leaderboard data
export const leaderboard = [
  { rank: 1, kelas: 'XI IPA 1', points: 450, medals: { gold: 3, silver: 2, bronze: 1 } },
  { rank: 2, kelas: 'XI IPA 2', points: 420, medals: { gold: 2, silver: 3, bronze: 2 } },
  { rank: 3, kelas: 'XI IPS 1', points: 390, medals: { gold: 2, silver: 2, bronze: 3 } },
  { rank: 4, kelas: 'XI IPS 2', points: 380, medals: { gold: 1, silver: 3, bronze: 3 } },
  { rank: 5, kelas: 'XI IPA 3', points: 360, medals: { gold: 1, silver: 2, bronze: 4 } }
]

// Voting data
export const votingSession: VotingSession = {
  id: '1',
  status: 'open',
  startTime: '2026-06-20 08:00',
  endTime: '2026-06-20 15:00',
  totalVoters: 450,
  votedCount: 320
}

// Mock voting history
export const userVotingHistory: { [key: string]: { candidateId: string; timestamp: string } } = {}
