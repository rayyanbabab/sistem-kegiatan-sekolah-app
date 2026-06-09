'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Vote, Users, BarChart3, ArrowRight } from 'lucide-react'

const MOCK_CANDIDATES = [
  { id: '1', number: 1, name: 'Siti Nurhaliza', kelas: 'XII IPA 1', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti', visiMisi: 'Menciptakan OSIS yang lebih inklusif dan responsif terhadap kebutuhan siswa. Fokus pada peningkatan program akademik dan non-akademik.', votes: 0 },
  { id: '2', number: 2, name: 'Budi Santoso', kelas: 'XII IPS 2', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', visiMisi: 'Membangun OSIS yang kuat dalam mengorganisir kegiatan sekolah. Meningkatkan partisipasi siswa dalam setiap program.', votes: 0 },
  { id: '3', number: 3, name: 'Rina Puspita', kelas: 'XII IPA 2', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina', visiMisi: 'OSIS yang transparan dan akuntabel. Mewujudkan program-program yang bermanfaat bagi seluruh siswa.', votes: 0 },
  { id: '4', number: 4, name: 'Hendra Wijaya', kelas: 'XII IPA 3', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra', visiMisi: 'Memajukan semangat gotong royong dan kebersamaan di sekolah. OSIS yang dekat dengan siswa.', votes: 0 },
]

const CANDIDATE_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
]

export default function CandidatesPage() {
  const { currentUser } = useAuth()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Vote className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Kandidat OSIS 2026</h1>
        <p className="text-white/40 mt-1">Kenali profil dan visi misi setiap kandidat</p>
      </div>

      {/* Voting info banner */}
      <div className="glass-card rounded-2xl p-4 border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-white">Voting Sedang Dibuka</p>
              <p className="text-xs text-white/40">Berikan suaramu sebelum 20 Juni 2026 pukul 16.00 WIB</p>
            </div>
          </div>
          {currentUser?.role === 'siswa' && (
            <Link href="/dashboard/pemilu/voting">
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-violet-500/20 flex-shrink-0">
                Mulai Voting <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {MOCK_CANDIDATES.map((candidate, idx) => {
          const gradColor = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length]
          return (
            <div key={candidate.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1 group">
              {/* Top gradient strip */}
              <div className={`h-1.5 bg-gradient-to-r ${gradColor}`} />

              <div className="p-5">
                <div className="flex gap-4">
                  {/* Photo + number */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10">
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br ${gradColor} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-sm">{candidate.number}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                      {candidate.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 mb-3">
                      <Users className="w-3 h-3 text-white/30" />
                      <span className="text-xs text-white/40">{candidate.kelas}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-lg font-bold text-white">{candidate.votes}</span>
                        <span className="text-xs text-white/40">suara</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visi Misi */}
                <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-xs text-white/30 mb-1 font-medium uppercase tracking-wider">Visi & Misi</p>
                  <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">
                    {candidate.visiMisi}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/pemilu/candidates/${candidate.id}`} className="flex-1">
                    <button className="w-full py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] text-sm transition">
                      Lihat Detail
                    </button>
                  </Link>
                  {currentUser?.role === 'siswa' && (
                    <Link href="/dashboard/pemilu/voting" className="flex-1">
                      <button className={`w-full py-2 rounded-xl bg-gradient-to-r ${gradColor} text-white text-sm font-semibold shadow-lg hover:opacity-90 transition`}>
                        Pilih #{candidate.number}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rules */}
      <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
        <p className="text-sm font-semibold text-blue-400 mb-3">📋 Aturan Pemilihan</p>
        <ul className="space-y-2 text-sm text-white/50">
          <li className="flex items-center gap-2"><span className="text-blue-400">•</span> Setiap siswa hanya bisa memilih satu kandidat</li>
          <li className="flex items-center gap-2"><span className="text-blue-400">•</span> Voting dilakukan secara anonim untuk menjaga privasi</li>
          <li className="flex items-center gap-2"><span className="text-blue-400">•</span> Pilihan tidak dapat diubah setelah dikonfirmasi</li>
          <li className="flex items-center gap-2"><span className="text-blue-400">•</span> Hasil real-time tersedia di halaman Real Count</li>
        </ul>
      </div>
    </div>
  )
}
