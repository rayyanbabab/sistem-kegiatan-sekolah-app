'use client'

import { candidates } from '@/lib/mockData'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Vote, Users, BarChart3, Star } from 'lucide-react'
import { useParams } from 'next/navigation'

const CANDIDATE_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
]

const PROGRAMS = [
  { emoji: '📚', title: 'Program Akademik', desc: 'Peningkatan fasilitas belajar dan program mentoring antar siswa' },
  { emoji: '🎭', title: 'Program Seni & Budaya', desc: 'Revitalisasi kegiatan seni untuk mengembangkan bakat siswa' },
  { emoji: '🤝', title: 'Program Sosial', desc: 'Kegiatan sosial dan gotong royong untuk masyarakat sekitar' },
  { emoji: '💻', title: 'Program Digital', desc: 'Modernisasi sistem informasi dan komunikasi OSIS' },
]

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string
  const candidate = candidates.find(c => c.id === candidateId)
  const colorIdx = candidate ? (parseInt(candidate.id) - 1) % CANDIDATE_COLORS.length : 0
  const color = CANDIDATE_COLORS[colorIdx]

  if (!candidate) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Kandidat Tidak Ditemukan</p>
        </div>
      </div>
    )
  }

  const pct = Math.round((candidate.votes / 450) * 100)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Back */}
      <Link href="/dashboard/pemilu/candidates">
        <button className="flex items-center gap-2 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Kandidat
        </button>
      </Link>

      {/* Hero Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${color}`} />
        <div className="p-6">
          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-2" style={{ borderColor: 'var(--glass-border)' }}>
                <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold">#{candidate.number}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{candidate.name}</h1>
              </div>
              <p className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                <Users className="w-3.5 h-3.5" /> {candidate.kelas}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Suara', value: candidate.votes, color: 'text-blue-400' },
                  { label: 'Persentase', value: `${pct}%`, color: 'text-violet-400' },
                  { label: 'Ranking', value: '#1', color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--subtle-border)' }}>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-1" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
              <Heart className="w-4 h-4" /> Sukai
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-1" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
              <Share2 className="w-4 h-4" /> Bagikan
            </button>
            <Link href="/dashboard/pemilu/voting" className="flex-1">
              <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${color} shadow-lg hover:opacity-90 transition`}>
                <Vote className="w-4 h-4" /> Pilih Kandidat Ini
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Visi dan Misi</h2>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
          {candidate.visiMisi}
        </p>
        <div className="p-3 rounded-xl border-l-2 border-violet-400 bg-violet-500/5">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold text-violet-400">Visi:</span> Menciptakan OSIS yang lebih responsif terhadap kebutuhan siswa dengan mengedepankan transparansi dan akuntabilitas dalam setiap keputusan.
          </p>
        </div>
      </div>

      {/* Program Kerja */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Program Kerja</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PROGRAMS.map(p => (
            <div key={p.title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
              <span className="text-2xl flex-shrink-0">{p.emoji}</span>
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voting Statistics */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Statistik Voting</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Perolehan Suara</span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{candidate.votes}/450</span>
            </div>
            <div className="w-full rounded-full h-2" style={{ background: 'var(--subtle-bg)' }}>
              <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'var(--subtle-bg)' }}>
            <p className="text-3xl font-bold text-violet-400">{pct}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>dari total suara masuk</p>
          </div>
        </div>
      </div>
    </div>
  )
}
