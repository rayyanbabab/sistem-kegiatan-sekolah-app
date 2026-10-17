'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Vote, Star, TrendingUp, Users, CheckCircle, RefreshCw, Video, Edit3, ExternalLink, Calendar, AlertCircle } from 'lucide-react'
import { Modal, FormField, Input, Textarea, ImageUpload, SubmitButton } from '@/components/ui/crud'

interface CandidateProfile {
  id: string
  number: number
  visiMisi: string
  campaignVideo: string | null
  photo: string | null
  votes: number
  user: { name: string; kelas: string | null; avatar: string | null }
}

interface VotingSessionInfo {
  totalVoters: number
  votedCount: number
  participationRate: number
  status: string
  startTime: string
  endTime: string
}

export default function CandidateProfilePage() {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState<CandidateProfile | null>(null)
  const [sessionInfo, setSessionInfo] = useState<VotingSessionInfo | null>(null)
  const [allCandidates, setAllCandidates] = useState<CandidateProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Edit form state
  const [formVisiMisi, setFormVisiMisi] = useState('')
  const [formVideo, setFormVideo] = useState('')
  const [formPhoto, setFormPhoto] = useState<string | null>(null)

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
          setAllCandidates(j.data)
          const mine = j.data.find((c: CandidateProfile) => c.user.name === currentUser?.name)
          if (mine) {
            setProfile(mine)
            setFormVisiMisi(mine.visiMisi)
            setFormVideo(mine.campaignVideo || '')
            setFormPhoto(mine.photo || mine.user.avatar || null)
          }
        }
      }
      if (resultsRes.ok) {
        const j = await resultsRes.json()
        if (j.success && j.data.votingSession) setSessionInfo(j.data.votingSession)
      }
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [currentUser?.name])

  const totalVoters = sessionInfo?.totalVoters || 450
  const myVotes = profile?.votes || 0
  const myPct = totalVoters > 0 ? Math.round((myVotes / totalVoters) * 100) : 0
  const myRank = profile
    ? [...allCandidates].sort((a, b) => b.votes - a.votes).findIndex(c => c.id === profile.id) + 1
    : 0

  const timelineItems = [
    { event: 'Pendaftaran Berkas Paslon', done: true, date: 'Terverifikasi Panitia' },
    {
      event: 'Masa Sosialisasi & Kampanye',
      done: true,
      date: 'Sedang Berlangsung'
    },
    {
      event: 'Pemungutan Suara Digital',
      done: sessionInfo?.status === 'OPEN' || sessionInfo?.status === 'CLOSED',
      date: sessionInfo ? new Date(sessionInfo.startTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Jadwal Ditentukan'
    },
    {
      event: 'Penetapan & Rekapitulasi Akhir',
      done: sessionInfo?.status === 'CLOSED',
      date: sessionInfo ? new Date(sessionInfo.endTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Setelah Voting Ditutup'
    },
  ]

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (!formVisiMisi.trim()) {
      setError('Visi dan misi wajib diisi')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/candidates/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          visiMisi: formVisiMisi,
          campaignVideo: formVideo || null,
          photo: formPhoto || null,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setShowEditModal(false)
        fetchData()
      } else {
        setError(json.error || 'Gagal menyimpan pembaruan profil')
      }
    } catch {
      setError('Gagal menghubungi server')
    }
    setSaving(false)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Portal Kandidat OSIS</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Profil Kampanye Saya
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kelola profil paslon, paparan visi misi, tautan media kampanye, serta pantau suara yang masuk.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {profile && (
            <button
              onClick={() => {
                setFormVisiMisi(profile.visiMisi)
                setFormVideo(profile.campaignVideo || '')
                setFormPhoto(profile.photo || profile.user.avatar || null)
                setError('')
                setShowEditModal(true)
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil Kampanye</span>
            </button>
          )}
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui Data</span>
          </button>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="surface-card rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="w-28 h-28 rounded-xl overflow-hidden bg-muted border border-border flex items-center justify-center font-bold text-2xl text-foreground">
              {profile?.photo || profile?.user.avatar ? (
                <img
                  src={profile?.photo || profile?.user.avatar!}
                  alt="Foto Paslon"
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser?.name?.charAt(0) || 'K'
              )}
            </div>
            {profile && (
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                #{profile.number}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                Pasangan Calon #{profile?.number ?? '-'}
              </span>
              <span className="text-xs text-muted-foreground">
                • Kelas {currentUser?.kelas || '-'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {currentUser?.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kandidat Ketua OSIS SMKS Digital Periode 2026/2027
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center">
                <span className="text-base sm:text-lg font-bold text-primary block leading-tight">
                  {loading ? '...' : myVotes}
                </span>
                <span className="text-[10px] text-muted-foreground">Suara Diperoleh</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center">
                <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 block leading-tight">
                  {loading ? '...' : `${myPct}%`}
                </span>
                <span className="text-[10px] text-muted-foreground">Persentase</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center">
                <span className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 block leading-tight">
                  {loading ? '...' : myRank > 0 ? `#${myRank}` : '-'}
                </span>
                <span className="text-[10px] text-muted-foreground">Peringkat Suara</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="surface-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm text-foreground">Visi & Pokok Gagasan Paslon</h2>
          </div>
          {profile && (
            <button
              onClick={() => {
                setFormVisiMisi(profile.visiMisi)
                setFormVideo(profile.campaignVideo || '')
                setFormPhoto(profile.photo || profile.user.avatar || null)
                setShowEditModal(true)
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Ubah Visi Misi
            </button>
          )}
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border border-border/80">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {profile?.visiMisi || 'Belum ada uraian visi misi. Klik "Edit Profil Kampanye" untuk melengkapi program kerja Anda.'}
          </p>
        </div>
      </div>

      {/* Media & Video Kampanye */}
      <div className="surface-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Video className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-sm text-foreground">Tautan Media Video Kampanye</h2>
        </div>
        {profile?.campaignVideo ? (
          <div className="p-4 rounded-lg bg-muted/30 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">Tautan Video Terdaftar</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {profile.campaignVideo}
              </p>
            </div>
            <a
              href={profile.campaignVideo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Video</span>
            </a>
          </div>
        ) : (
          <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
            Belum ada tautan video kampanye YouTube. Anda dapat menambahkan video pemaparan program agar siswa mengenal Anda lebih dekat.
          </div>
        )}
      </div>

      {/* Tahapan Pemilu */}
      <div className="surface-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-bold text-sm text-foreground">Tahapan Pelaksanaan Pemilu</h2>
        </div>
        <div className="space-y-3">
          {timelineItems.map((t, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/80">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                t.done ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-muted text-muted-foreground border border-border'
              }`}>
                {t.done ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="text-[11px] font-bold">{idx + 1}</span>}
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <p className="text-xs font-semibold text-foreground">{t.event}</p>
                <span className="text-[11px] text-muted-foreground">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit Profil */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profil Kampanye Paslon"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <FormField label="Foto Profil / Paslon" hint="Gunakan foto formal berukuran proporsional">
            <ImageUpload
              value={formPhoto}
              onChange={setFormPhoto}
              shape="square"
              size={84}
              placeholder="Unggah foto kandidat resmi"
            />
          </FormField>

          <FormField label="Uraian Visi & Misi" hint="Tuliskan visi, program unggulan, dan komitmen" required>
            <Textarea
              rows={5}
              value={formVisiMisi}
              onChange={e => setFormVisiMisi(e.target.value)}
              placeholder="Visi: Mewujudkan siswa yang mandiri, kreatif, dan berintegritas..."
              required
            />
          </FormField>

          <FormField label="URL Video Kampanye" hint="Tautan video YouTube pemaparan program (opsional)">
            <Input
              type="url"
              value={formVideo}
              onChange={e => setFormVideo(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </FormField>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <SubmitButton loading={saving} label="Simpan Profil Kampanye" />
        </form>
      </Modal>
    </div>
  )
}
