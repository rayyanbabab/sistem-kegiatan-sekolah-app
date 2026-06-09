'use client'

import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Trophy, Calendar, Clock, MapPin, Users, Zap, ChevronRight } from 'lucide-react'

const COMPETITIONS = [
  { id: '1', name: 'Futsal Putra', category: 'Olahraga', date: '2026-06-20', time: '08:00', location: 'Lapangan Utama', teams: 8, maxTeams: 16, status: 'open', icon: '⚽', color: 'from-blue-500 to-cyan-500' },
  { id: '2', name: 'Volley Ball Putri', category: 'Olahraga', date: '2026-06-21', time: '09:00', location: 'GOR Sekolah', teams: 6, maxTeams: 12, status: 'open', icon: '🏐', color: 'from-green-500 to-emerald-500' },
  { id: '3', name: 'Badminton Ganda', category: 'Olahraga', date: '2026-06-22', time: '08:00', location: 'Aula Olahraga', teams: 10, maxTeams: 16, status: 'open', icon: '🏸', color: 'from-orange-500 to-amber-500' },
  { id: '4', name: 'Debat Bahasa Indonesia', category: 'Akademik', date: '2026-06-20', time: '10:00', location: 'Ruang Aula', teams: 4, maxTeams: 8, status: 'open', icon: '🎤', color: 'from-violet-500 to-purple-500' },
  { id: '5', name: 'Cerdas Cermat', category: 'Akademik', date: '2026-06-21', time: '13:00', location: 'Ruang 301', teams: 5, maxTeams: 10, status: 'open', icon: '🧠', color: 'from-pink-500 to-rose-500' },
  { id: '6', name: 'Seni Tari Kreasi', category: 'Seni', date: '2026-06-23', time: '14:00', location: 'Panggung Utama', teams: 3, maxTeams: 8, status: 'open', icon: '💃', color: 'from-amber-500 to-yellow-500' },
]

const CATEGORY_COLORS: Record<string, string> = {
  Olahraga: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Akademik: 'bg-green-500/10 text-green-400 border-green-500/20',
  Seni: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

export default function CompetitionsPage() {
  const { currentUser } = useAuth()
  const categories = [...new Set(COMPETITIONS.map(c => c.category))]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Daftar Kompetisi</h1>
        <p className="text-white/40 mt-1">Pilih kompetisi dan daftarkan tim kelas Anda</p>
      </div>

      {/* Summary (admin only) */}
      {currentUser?.role === 'super-admin' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Kompetisi', value: COMPETITIONS.length, color: 'from-amber-500 to-orange-400', icon: Trophy },
            { label: 'Tim Terdaftar', value: COMPETITIONS.reduce((s, c) => s + c.teams, 0), color: 'from-blue-500 to-cyan-400', icon: Users },
            { label: 'Kategori', value: categories.length, color: 'from-violet-500 to-purple-400', icon: Zap },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-white/50">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Competitions by Category */}
      {categories.map(cat => (
        <div key={cat} className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${CATEGORY_COLORS[cat] || 'bg-white/10 text-white/60 border-white/10'}`}>
              {cat}
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-white/30">{COMPETITIONS.filter(c => c.category === cat).length} lomba</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {COMPETITIONS.filter(c => c.category === cat).map(comp => {
              const pct = Math.round((comp.teams / comp.maxTeams) * 100)
              const isFull = comp.teams >= comp.maxTeams

              return (
                <div key={comp.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                  <div className={`h-1.5 bg-gradient-to-r ${comp.color}`} />
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl">{comp.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-base">{comp.name}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <Calendar className="w-3 h-3" />
                            {new Date(comp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            {comp.time} WIB
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-white/40 col-span-2">
                            <MapPin className="w-3 h-3" />
                            {comp.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1 text-white/40">
                          <Users className="w-3 h-3" />
                          <span>{comp.teams}/{comp.maxTeams} tim</span>
                        </div>
                        <span className={isFull ? 'text-red-400' : 'text-green-400'}>{isFull ? 'Penuh' : `${pct}% terisi`}</span>
                      </div>
                      <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${comp.color} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-3 border-t border-white/[0.06]">
                      {currentUser?.role === 'ketua-kelas' ? (
                        <Link href={`/dashboard/classmeeting/competitions/${comp.id}/register`}>
                          <button disabled={isFull} className={`w-full py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                            isFull
                              ? 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.06]'
                              : `bg-gradient-to-r ${comp.color} text-white shadow-lg hover:opacity-90`
                          }`}>
                            {isFull ? 'Kuota Penuh' : 'Daftarkan Tim'} {!isFull && <ChevronRight className="w-4 h-4" />}
                          </button>
                        </Link>
                      ) : currentUser?.role === 'super-admin' ? (
                        <button className="w-full py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.05] text-sm transition flex items-center justify-center gap-2">
                          Kelola Pendaftaran <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="text-center text-xs text-white/30 py-2">
                          Hanya Ketua Kelas yang bisa mendaftar
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Rules */}
      <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
        <p className="text-sm font-semibold text-blue-400 mb-3">📋 Syarat Pendaftaran</p>
        <ul className="space-y-1.5 text-sm text-white/50">
          <li>• Setiap kelas dapat mendaftarkan satu tim per kategori lomba</li>
          <li>• Tim harus memiliki anggota minimal sesuai ketentuan kompetisi</li>
          <li>• Pendaftaran ditutup 3 hari sebelum hari pelaksanaan</li>
          <li>• Ketua kelas bertanggung jawab atas pengelolaan tim</li>
        </ul>
      </div>
    </div>
  )
}
