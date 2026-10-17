'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Trophy, Users, Search, RefreshCw, ExternalLink, ArrowRight, Video, ChevronDown, ChevronUp, Vote } from 'lucide-react'

interface Candidate {
  id: string
  number: number
  visiMisi: string
  campaignVideo: string | null
  photo: string | null
  votes: number
  user: { id: string; name: string; kelas: string | null; avatar: string | null }
}

export default function CandidatesPage() {
  const { currentUser } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/candidates', { credentials: 'include' })
      const json = await res.json()
      if (json.success) setCandidates(json.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const filtered = candidates.filter(c =>
    c.user.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.user.kelas && c.user.kelas.toLowerCase().includes(search.toLowerCase())) ||
    c.visiMisi.toLowerCase().includes(search.toLowerCase())
  )

  const isPrivileged = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Pemilu Raya OSIS</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Daftar Kandidat Paslon
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pelajari rekam jejak, visi, misi, dan gagasan program kerja para kandidat sebelum memberikan suara.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pemilu/voting">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
              <Vote className="w-3.5 h-3.5" />
              <span>Buka Bilik Suara</span>
            </button>
          </Link>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kandidat atau kelas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground self-start sm:self-center">
          Menampilkan {filtered.length} dari {candidates.length} paslon
        </p>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="surface-card rounded-xl h-64 animate-pulse bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {search ? 'Tidak ada kandidat sesuai pencarian' : 'Belum Ada Paslon Terdaftar'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Data kandidat paslon akan ditampilkan setelah panitia mendaftarkannya ke sistem.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(c => {
            const isExpanded = expandedId === c.id
            const photoUrl = c.photo || c.user.avatar

            return (
              <div
                key={c.id}
                className="surface-card rounded-xl border border-border p-5 sm:p-6 flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  {/* Paslon Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center font-bold text-lg text-foreground">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={c.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          c.user.name.charAt(0)
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[11px] font-bold shadow-xs">
                        #{c.number}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Pasangan Calon #{c.number}
                        </span>
                        {c.user.kelas && (
                          <span className="text-[11px] text-muted-foreground">
                            • Kelas {c.user.kelas}
                          </span>
                        )}
                      </div>
                      <h2 className="font-bold text-base text-foreground truncate">
                        {c.user.name}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Kandidat Ketua OSIS SMKS Digital
                      </p>
                    </div>

                    {isPrivileged && (
                      <div className="shrink-0 text-right pl-2">
                        <span className="text-lg font-bold text-foreground block leading-tight">
                          {c.votes}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Suara
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Visi Misi Container */}
                  <div className="p-3.5 rounded-lg bg-muted/40 border border-border/80 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-foreground">Visi & Pokok Gagasan:</span>
                      {c.visiMisi.length > 140 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : c.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                        >
                          {isExpanded ? (
                            <><span>Ringkas</span><ChevronUp className="w-3 h-3" /></>
                          ) : (
                            <><span>Baca Penuh</span><ChevronDown className="w-3 h-3" /></>
                          )}
                        </button>
                      )}
                    </div>
                    <p className={`text-xs text-muted-foreground leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {c.visiMisi}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                  {c.campaignVideo ? (
                    <a
                      href={c.campaignVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Video Kampanye</span>
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">Profil Terverifikasi</span>
                  )}

                  <Link href={`/dashboard/pemilu/candidate/${c.id}`}>
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors">
                      <span>Detail Profil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
