'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Trophy, ArrowLeft, Plus, Trash2, Users,
  CheckCircle, Calendar, Clock, MapPin, AlertCircle,
  Dumbbell, Mic2, Palette, LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { FormField, Input, Select, SubmitButton } from '@/components/ui/crud'

interface Competition {
  id: string
  name: string
  category: string
  date: string
  time: string
  location: string
  event: { name: string }
  _count: { teams: number }
}

const CAT_ICON: Record<string, LucideIcon> = {
  OLAHRAGA: Dumbbell,
  AKADEMIK: Mic2,
  SENI: Palette,
}

export default function RegisterTeamPage() {
  const params = useParams()
  const router = useRouter()
  const { currentUser } = useAuth()
  const id = params?.id as string

  const [comp, setComp] = useState<Competition | null>(null)
  const [loadingComp, setLoadingComp] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [kelasList, setKelasList] = useState<{ value: string; label: string }[]>([])

  const [teamName, setTeamName] = useState('')
  const [kelas, setKelas] = useState(currentUser?.kelas ?? '')
  const [members, setMembers] = useState<string[]>([''])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch competition data from API
  useEffect(() => {
    const fetchComp = async () => {
      setLoadingComp(true)
      try {
        const [compRes, kelasRes] = await Promise.all([
          fetch(`/api/competitions/${id}`, { credentials: 'include' }),
          fetch('/api/kelas', { credentials: 'include' }),
        ])
        if (compRes.status === 404) { setNotFound(true); setLoadingComp(false); return }
        const json = await compRes.json()
        if (json.success) {
          setComp(json.data)
          setTeamName(`Tim ${json.data.name} ${currentUser?.kelas ?? ''}`)
        } else {
          setNotFound(true)
        }

        const kj = await kelasRes.json()
        if (kj.success && kj.data) {
          setKelasList(kj.data.map((k: any) => ({ value: k.name, label: k.name })))
        }
      } catch {
        setNotFound(true)
      }
      setLoadingComp(false)
    }
    if (id) fetchComp()
  }, [id, currentUser?.kelas])

  // Member helpers
  const addMember = () => setMembers(m => [...m, ''])
  const removeMember = (i: number) => setMembers(m => m.filter((_, idx) => idx !== i))
  const updateMember = (i: number, v: string) => setMembers(m => m.map((x, idx) => idx === i ? v : x))

  const filledMembers = members.filter(m => m.trim())
  const canSubmit = teamName.trim() && kelas && filledMembers.length >= 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !comp) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: teamName,
          kelas,
          competitionId: comp.id,
          members: filledMembers.map(name => ({ name })),
        }),
      })
      const json = await res.json()
      if (json.success) {
        setSubmitted(true)
      } else {
        setError(json.error || 'Gagal mendaftarkan tim')
      }
    } catch {
      setError('Gagal terhubung ke server')
    }
    setLoading(false)
  }

  // Loading
  if (loadingComp) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-4">
      <div className="h-6 w-48 rounded-md bg-muted animate-pulse" />
      <div className="surface-card rounded-xl h-40 bg-muted animate-pulse" />
      <div className="surface-card rounded-xl h-64 bg-muted animate-pulse" />
    </div>
  )

  // 404 guard
  if (notFound || !comp) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto text-center space-y-4 mt-12">
      <div className="surface-card rounded-xl p-12 border border-border">
        <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h1 className="text-base font-bold text-foreground">Kompetisi Tidak Ditemukan</h1>
        <p className="text-xs text-muted-foreground mt-1">Data cabang lomba tidak valid atau telah dihapus.</p>
        <Link href="/dashboard/classmeeting/competitions">
          <button className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
            Kembali ke Daftar Lomba
          </button>
        </Link>
      </div>
    </div>
  )

  const CatIcon = CAT_ICON[comp.category] || Trophy

  // Success screen
  if (submitted) return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto mt-6 animate-fade-in-up">
      <div className="surface-card rounded-2xl p-8 border border-border text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Pendaftaran Delegasi Berhasil!
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Tim <strong className="text-foreground">{teamName}</strong> telah tercatat untuk cabang <strong>{comp.name}</strong>. Panitia akan memverifikasi berkas delegasi kelas Anda.
        </p>

        <div className="p-4 rounded-xl bg-muted/40 border border-border text-left space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Daftar Anggota Tim ({filledMembers.length}):
          </p>
          <div className="space-y-1.5">
            {filledMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                <span className="w-5 h-5 rounded-md bg-secondary text-foreground/80 border border-border font-bold flex items-center justify-center text-[10px] shrink-0">
                  {i + 1}
                </span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link href="/dashboard/classmeeting/my-teams" className="flex-1">
            <button className="w-full py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs">
              Lihat Tim Kelas Saya
            </button>
          </Link>
          <Link href="/dashboard/classmeeting/competitions" className="flex-1">
            <button className="w-full py-2.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors">
              Pilih Lomba Lain
            </button>
          </Link>
        </div>
      </div>
    </div>
  )

  // Main form
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/classmeeting/competitions"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Cabang Lomba</span>
      </Link>

      {/* Header Info Card */}
      <div className="surface-card rounded-xl border border-border p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
            <CatIcon className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-primary block mb-0.5">
              Pendaftaran Delegasi • {comp.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {comp.name}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>
                  {new Date(comp.date).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{comp.time} WIB</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{comp.location}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>{comp._count.teams} Tim Terdaftar</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="surface-card rounded-xl border border-border p-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Data Delegasi Tim
          </h2>

          <FormField label="Nama Tim Delegasi" hint="Contoh: Tim Futsal XII RPL 1" required>
            <Input
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="Contoh: Tim Futsal XII RPL 1"
              required
            />
          </FormField>

          <FormField label="Kelas Asal" required>
            {kelasList.length > 0 ? (
              <Select
                value={kelas}
                onChange={e => setKelas(e.target.value)}
                options={kelasList}
                placeholder="Pilih kelas..."
                required
              />
            ) : (
              <Input
                value={kelas}
                onChange={e => setKelas(e.target.value)}
                placeholder="Contoh: XII RPL 1"
                required
              />
            )}
          </FormField>
        </div>

        {/* Anggota Tim */}
        <div className="surface-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Susunan Anggota Tim
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Masukkan nama lengkap siswa anggota regu/pemain
              </p>
            </div>
            <button
              type="button"
              onClick={addMember}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors border border-border"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pemain</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-muted text-foreground font-semibold text-xs flex items-center justify-center shrink-0 border border-border">
                  {idx + 1}
                </span>
                <Input
                  value={member}
                  onChange={e => updateMember(idx, e.target.value)}
                  placeholder={`Nama lengkap anggota ${idx + 1}`}
                  required={idx === 0}
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 border border-border"
                    title="Hapus baris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <SubmitButton
          loading={loading}
          label="Kirim Pendaftaran Delegasi"
          loadingLabel="Mendaftarkan..."
        />
      </form>
    </div>
  )
}
