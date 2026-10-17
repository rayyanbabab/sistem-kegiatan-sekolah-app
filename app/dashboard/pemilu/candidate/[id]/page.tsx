'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Vote, Users, BarChart3, Star, ExternalLink, Video, CheckCircle2, VideoOff } from 'lucide-react'

interface CandidateDetail {
  id: string
  number: number
  visiMisi: string
  campaignVideo: string | null
  photo: string | null
  votes: number
  user: { name: string; kelas: string | null; avatar: string | null }
}

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string

  const [candidate, setCandidate] = useState<CandidateDetail | null>(null)
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [candRes, resultsRes] = await Promise.all([
          fetch('/api/candidates', { credentials: 'include' }),
          fetch('/api/voting/results', { credentials: 'include' }),
        ])
        if (candRes.ok) {
          const j = await candRes.json()
          if (j.success) {
            const found = j.data.find((c: CandidateDetail) => c.id === candidateId)
            if (found) setCandidate(found)
            else setNotFound(true)
          }
        }
        if (resultsRes.ok) {
          const j = await resultsRes.json()
          if (j.success) setTotalVotes(j.data.votingSession?.votedCount || 0)
        }
      } catch {
        setNotFound(true)
      }
      setLoading(false)
    }
    if (candidateId) fetchData()
  }, [candidateId])

  if (loading) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
      <div className="h-6 w-36 rounded-md bg-muted animate-pulse" />
      <div className="surface-card rounded-xl h-64 animate-pulse bg-muted" />
      <div className="surface-card rounded-xl h-44 animate-pulse bg-muted" />
    </div>
  )

  if (notFound || !candidate) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="surface-card rounded-xl p-12 text-center border border-border">
        <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <h2 className="text-base font-bold text-foreground">Kandidat Tidak Ditemukan</h2>
        <p className="text-xs text-muted-foreground mt-1">Data paslon tidak terdaftar atau telah dihapus.</p>
        <Link href="/dashboard/pemilu/candidates">
          <button className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
            Kembali ke Daftar Paslon
          </button>
        </Link>
      </div>
    </div>
  )

  const pct = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0
  const photoUrl = candidate.photo || candidate.user.avatar

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/pemilu/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Kandidat</span>
        </Link>
      </div>

      {/* Main Profile Card */}
      <div className="surface-card rounded-xl border border-border overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center font-bold text-3xl text-foreground">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={candidate.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                candidate.user.name.charAt(0)
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-xs">
              #{candidate.number}
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="academic-badge text-amber-700 dark:text-amber-300">
                Pasangan Calon #{candidate.number}
              </span>
              <span className="text-xs text-muted-foreground">
                Kelas {candidate.user.kelas || '-'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {candidate.user.name}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Calon Ketua OSIS SMKS Digital Periode 2026/2027
            </p>

            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center">
                <span className="text-lg font-bold text-foreground block leading-tight">
                  #{candidate.number}
                </span>
                <span className="text-[11px] text-muted-foreground">Nomor Urut</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center">
                <span className="text-lg font-bold text-primary block leading-tight">
                  {candidate.votes}
                </span>
                <span className="text-[11px] text-muted-foreground">Suara Masuk</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center">
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block leading-tight">
                  {pct}%
                </span>
                <span className="text-[11px] text-muted-foreground">Persentase</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-border">
          {candidate.campaignVideo && (
            <a
              href={candidate.campaignVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
            >
              <Video className="w-4 h-4 text-primary" />
              <span>Tonton Video Kampanye</span>
            </a>
          )}
          <Link href="/dashboard/pemilu/voting" className="flex-1 min-w-[200px]">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
              <Vote className="w-4 h-4" />
              <span>Beri Suara di Bilik Digital</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Visi dan Misi */}
      <div className="surface-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-amber-500" />
          <h2 className="font-bold text-sm text-foreground">Visi & Pokok Gagasan</h2>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border border-border/80">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {candidate.visiMisi}
          </p>
        </div>
      </div>

      {/* Video Preview or Info */}
      <div className="surface-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-sm text-foreground">Media Kampanye</h2>
        </div>
        {candidate.campaignVideo ? (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-foreground">Video Pemaparan Program</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                {candidate.campaignVideo}
              </p>
            </div>
            <a
              href={candidate.campaignVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tautan</span>
            </a>
          </div>
        ) : (
          <div className="p-6 rounded-lg border border-dashed border-border text-center">
            <VideoOff className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Kandidat belum menyematkan video kampanye digital.</p>
          </div>
        )}
      </div>
    </div>
  )
}
