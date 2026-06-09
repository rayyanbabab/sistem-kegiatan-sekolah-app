'use client'

import { useAuth } from '@/context/AuthContext'
import { Vote, Camera, Edit3, FileText, Star, TrendingUp, Users, CheckCircle } from 'lucide-react'

const PROGRAMS = [
  { emoji: '📚', title: 'Program Akademik', desc: 'Peningkatan fasilitas belajar dan mentoring antar siswa' },
  { emoji: '🎭', title: 'Program Seni & Budaya', desc: 'Revitalisasi kegiatan seni untuk mengembangkan bakat' },
  { emoji: '🤝', title: 'Program Sosial', desc: 'Kegiatan sosial dan gotong royong untuk masyarakat' },
  { emoji: '💻', title: 'Program Digital', desc: 'Modernisasi sistem informasi dan komunikasi OSIS' },
]

const TIMELINE = [
  { date: '10 Juni 2026', event: 'Pendaftaran Kandidat Dibuka', status: 'done' },
  { date: '15 Juni 2026', event: 'Batas Akhir Upload Profil', status: 'done' },
  { date: '20 Juni 2026', event: 'Voting Dibuka', status: 'upcoming' },
  { date: '22 Juni 2026', event: 'Voting Ditutup', status: 'upcoming' },
  { date: '23 Juni 2026', event: 'Pengumuman Pemenang', status: 'upcoming' },
]

export default function CandidateProfilePage() {
  const { currentUser } = useAuth()

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Vote className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Profil Kampanye Saya</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Kelola profil kampanye dan program kerja Anda</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-violet-500 to-pink-500" />
        <div className="p-6">
          <div className="flex gap-5 flex-col sm:flex-row">
            {/* Photo */}
            <div className="relative flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl overflow-hidden" style={{ border: '2px solid var(--glass-border)' }}>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'candidate'}`}
                  alt="Foto Kandidat"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg hover:bg-violet-400 transition">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {currentUser?.name || 'Nama Kandidat'}
                </h2>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 flex-shrink-0">
                  Kandidat #3
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {currentUser?.kelas || 'XII IPA 2'} · SMKS Digital
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Suara', value: '73', color: 'text-violet-400' },
                  { label: 'Persentase', value: '20%', color: 'text-pink-400' },
                  { label: 'Ranking', value: '#3', color: 'text-amber-400' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visi Misi */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Visi & Misi</h2>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
            <Edit3 className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Mewujudkan OSIS yang inklusif, transparan, dan berdampak nyata bagi seluruh siswa SMKS Digital dengan program-program inovatif yang mendorong kreativitas dan kolaborasi antar kelas.
          </p>
        </div>
      </div>

      {/* Program Kerja */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Program Kerja</h2>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)', border: '1px solid var(--subtle-border)' }}>
            <Edit3 className="w-3 h-3" /> Edit
          </button>
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

      {/* Timeline */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Timeline Pemilu</h2>
        </div>
        <div className="space-y-3">
          {TIMELINE.map((t, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                t.status === 'done' ? 'bg-green-500/15 border border-green-500/30' : 'bg-white/5 border border-white/10'
              }`}>
                {t.status === 'done'
                  ? <CheckCircle className="w-4 h-4 text-green-400" />
                  : <div className="w-2 h-2 rounded-full bg-white/20" />
                }
              </div>
              <div className="flex-1 flex items-center justify-between gap-3">
                <p className="text-sm" style={{ color: t.status === 'done' ? 'var(--text-secondary)' : 'var(--text-faint)' }}>
                  {t.event}
                </p>
                <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-faint)' }}>{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kelola Dukungan */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-pink-400" />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Pendukung</h2>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 border-2 flex items-center justify-center text-xs text-white font-bold" style={{ borderColor: 'var(--sidebar-surface)' }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>73 siswa mendukung</p>
            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>dari 450 total pemilih</p>
          </div>
          <div className="ml-auto">
            <div className="w-16 h-2 rounded-full" style={{ background: 'var(--subtle-border)' }}>
              <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: '20%' }} />
            </div>
            <p className="text-[10px] text-right mt-1 text-violet-400">20%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
