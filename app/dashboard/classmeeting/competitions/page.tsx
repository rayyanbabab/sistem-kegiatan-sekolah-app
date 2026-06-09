'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Trophy, Calendar, Clock, MapPin, Users, ChevronRight, RefreshCw } from 'lucide-react'

interface Competition {
  id: string
  name: string
  category: 'OLAHRAGA' | 'AKADEMIK' | 'SENI'
  date: string
  time: string
  location: string
  event: { id: string; name: string }
  _count: { teams: number; results: number }
}

const CAT_CFG: Record<string, { color: string; border: string; text: string; gradient: string; icon: string }> = {
  OLAHRAGA: { color: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500', icon: '⚽' },
  AKADEMIK:  { color: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', gradient: 'from-violet-500 to-purple-500', icon: '🎤' },
  SENI:      { color: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500 to-yellow-500', icon: '🎨' },
}

export default function CompetitionsPage() {
  const { currentUser } = useAuth()
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/competitions', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setCompetitions(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const categories = [...new Set(competitions.map(c => c.category))]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Daftar Kompetisi</h1>
          <p className="mt-1" style={{ color: 'var(--text-muted)' }}>Pilih kompetisi dan daftarkan tim kelas Anda</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card rounded-2xl p-5 space-y-3 animate-pulse">
              <div className="h-5 rounded w-1/2" style={{ background: 'var(--subtle-bg)' }} />
              <div className="h-3 rounded" style={{ background: 'var(--subtle-bg)' }} />
              <div className="h-3 rounded w-3/4" style={{ background: 'var(--subtle-bg)' }} />
              <div className="h-9 rounded-xl" style={{ background: 'var(--subtle-bg)' }} />
            </div>
          ))}
        </div>
      ) : competitions.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada kompetisi</p>
        </div>
      ) : (
        /* By category */
        categories.map(cat => {
          const cfg = CAT_CFG[cat] || CAT_CFG.OLAHRAGA
          const comps = competitions.filter(c => c.category === cat)
          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${cfg.color} ${cfg.text} ${cfg.border}`}>
                  {cfg.icon} {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--subtle-border)' }} />
                <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{comps.length} lomba</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {comps.map(comp => (
                  <div key={comp.id} className="glass-card rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:-translate-y-0.5 group">
                    <div className={`h-1.5 bg-gradient-to-r ${cfg.gradient}`} />
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-3xl">{cfg.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{comp.name}</h3>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                              <Calendar className="w-3 h-3" />
                              {new Date(comp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                              <Clock className="w-3 h-3" /> {comp.time} WIB
                            </div>
                            <div className="flex items-center gap-1.5 text-xs col-span-2" style={{ color: 'var(--text-muted)' }}>
                              <MapPin className="w-3 h-3" /> {comp.location}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-faint)' }}>
                        <Users className="w-3 h-3" /> {comp._count.teams} tim terdaftar
                      </div>

                      <div className="pt-3" style={{ borderTop: '1px solid var(--subtle-border)' }}>
                        {currentUser?.role === 'KETUA_KELAS' ? (
                          <Link href={`/dashboard/classmeeting/competitions/${comp.id}/register`}>
                            <button className={`w-full py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.gradient} text-white shadow-lg hover:opacity-90`}>
                              Daftarkan Tim <ChevronRight className="w-4 h-4" />
                            </button>
                          </Link>
                        ) : currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA' ? (
                          <Link href={`/dashboard/classmeeting/teams`}>
                            <button className="w-full py-2.5 rounded-xl border text-sm transition flex items-center justify-center gap-2" style={{ borderColor: 'var(--subtle-border)', color: 'var(--text-muted)' }}>
                              Kelola Pendaftaran <ChevronRight className="w-4 h-4" />
                            </button>
                          </Link>
                        ) : (
                          <div className="text-center text-xs py-2" style={{ color: 'var(--text-faint)' }}>
                            Hanya Ketua Kelas yang bisa mendaftar
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
