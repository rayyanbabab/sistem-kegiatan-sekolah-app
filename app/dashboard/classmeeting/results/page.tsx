'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy, Star, Medal, RefreshCw, Plus, Trash2, Dumbbell, Mic2, Palette, Search, Layers, LucideIcon } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Select, Input, SubmitButton } from '@/components/ui/crud'

interface Result {
  id: string
  position: number
  points: number
  medal: string | null
  team: { id: string; name: string; kelas: string }
  competition: { id: string; name: string; category: string }
}

interface Team {
  id: string
  name: string
  kelas: string
  competition: { id: string; name: string }
}

interface Competition {
  id: string
  name: string
  category: string
}

const MEDAL_OPTS = [
  { value: 'GOLD', label: 'Juara 1 (Medali Emas)' },
  { value: 'SILVER', label: 'Juara 2 (Medali Perak)' },
  { value: 'BRONZE', label: 'Juara 3 (Medali Perunggu)' },
  { value: 'NONE', label: 'Tanpa Medali' },
]

const CAT_ICON: Record<string, LucideIcon> = {
  OLAHRAGA: Dumbbell,
  AKADEMIK: Mic2,
  SENI: Palette,
}

const MEDAL_CFG: Record<string, { label: string; badgeClass: string }> = {
  GOLD:   { label: 'Emas (1)',     badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
  SILVER: { label: 'Perak (2)',    badgeClass: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25' },
  BRONZE: { label: 'Perunggu (3)', badgeClass: 'bg-amber-700/10 text-amber-800 dark:text-amber-500 border-amber-700/25' },
  NONE:   { label: 'Peserta',      badgeClass: 'bg-secondary text-muted-foreground border-border' },
}

const EMPTY = { competitionId: '', teamId: '', position: '1', points: '100', medal: 'GOLD' }

export default function ResultsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [results, setResults] = useState<Result[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [comps, setComps] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Result | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [rr, tr, cr] = await Promise.all([
        fetch('/api/results', { credentials: 'include' }),
        fetch('/api/teams?status=APPROVED', { credentials: 'include' }),
        fetch('/api/competitions', { credentials: 'include' }),
      ])
      const rj = await rr.json(); if (rj.success) setResults(rj.data)
      const tj = await tr.json(); if (tj.success) setTeams(tj.data)
      const cj = await cr.json(); if (cj.success) setComps(cj.data)
    } catch { }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreate = () => {
    setForm({ ...EMPTY, competitionId: comps[0]?.id || '' })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.competitionId || !form.teamId) {
      setError('Kompetisi dan tim peserta wajib dipilih')
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          competitionId: form.competitionId,
          teamId: form.teamId,
          position: parseInt(form.position) || 1,
          points: parseInt(form.points) || 0,
          medal: form.medal,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setShowModal(false)
        fetchData()
      } else {
        setError(json.error || 'Gagal menyimpan hasil lomba')
      }
    } catch {
      setError('Gagal menghubungi server')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await fetch(`/api/results/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteTarget(null)
      fetchData()
    } catch { }
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  // Group by competition
  const byComp: Record<string, Result[]> = {}
  results.forEach(r => {
    if (!byComp[r.competition.id]) byComp[r.competition.id] = []
    byComp[r.competition.id].push(r)
  })
  Object.values(byComp).forEach(arr => arr.sort((a, b) => a.position - b.position))

  // Filtered by search
  const filteredCompEntries = Object.entries(byComp).filter(([_, compResults]) => {
    const compName = compResults[0].competition.name.toLowerCase()
    const matchComp = compName.includes(search.toLowerCase())
    const matchTeam = compResults.some(r => r.team.name.toLowerCase().includes(search.toLowerCase()) || r.team.kelas.toLowerCase().includes(search.toLowerCase()))
    return matchComp || matchTeam
  })

  const filteredTeams = form.competitionId
    ? teams.filter(t => t.competition?.id === form.competitionId)
    : teams
  const compOpts = comps.map(c => ({ value: c.id, label: c.name }))
  const teamOpts = filteredTeams.map(t => ({ value: t.id, label: `${t.name} (${t.kelas})` }))

  const POS_OPT = [
    { value: '1', label: 'Juara 1' },
    { value: '2', label: 'Juara 2' },
    { value: '3', label: 'Juara 3' },
    { value: '4', label: 'Peringkat 4' },
    { value: '5', label: 'Peringkat 5' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <span className="academic-badge mb-2">Classmeeting 2026</span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Hasil Pertandingan & Juara
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Pencatatan resmi pemenang lomba, alokasi medali, dan penambahan poin ke klasemen kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Perbarui</span>
          </button>
          {isAdmin && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Input Hasil Lomba</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {Object.keys(byComp).length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Cabang Diselesaikan</p>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {results.filter(r => r.medal === 'GOLD').length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Medali Emas Diraih</p>
          </div>
        </div>

        <div className="surface-card p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center shrink-0">
            <Medal className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              {results.length}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Rekap Posisi</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari cabang lomba atau tim..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg text-xs bg-background border border-input text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Results by Competition */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="surface-card rounded-xl h-48 bg-muted animate-pulse" />)}
        </div>
      ) : filteredCompEntries.length === 0 ? (
        <div className="surface-card rounded-xl p-12 text-center border border-dashed border-border">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            {search ? 'Tidak ada hasil pertandingan sesuai pencarian' : 'Belum Ada Hasil Pertandingan'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Gunakan tombol "Input Hasil Lomba" untuk mencatat pemenang dan mendistribusikan poin ke leaderboard.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredCompEntries.map(([compId, compResults]) => {
            const comp = compResults[0].competition
            const Icon = CAT_ICON[comp.category] || Trophy

            return (
              <div key={compId} className="surface-card rounded-xl border border-border overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-secondary text-foreground/80 border border-border flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground leading-tight">{comp.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{comp.category}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {compResults.length} Juara
                  </span>
                </div>

                <div className="p-4 divide-y divide-border/60">
                  {compResults.map(r => {
                    const mc = MEDAL_CFG[r.medal || 'NONE']
                    return (
                      <div key={r.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border shrink-0 ${mc.badgeClass}`}>
                            {mc.label}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                              {r.team.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Kelas {r.team.kelas} • <span className="text-primary font-medium">+{r.points} Poin</span>
                            </p>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => setDeleteTarget(r)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            title="Hapus hasil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Input Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Input Pemenang Pertandingan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Cabang Kompetisi" required>
            <Select
              value={form.competitionId}
              onChange={e => { f('competitionId')(e.target.value); f('teamId')('') }}
              options={compOpts}
              placeholder="Pilih kompetisi..."
              required
            />
          </FormField>

          <FormField label="Tim Pemenang" required>
            <Select
              value={form.teamId}
              onChange={e => f('teamId')(e.target.value)}
              options={teamOpts}
              placeholder={form.competitionId ? 'Pilih tim delegasi...' : 'Pilih kompetisi terlebih dahulu'}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Peringkat Juara">
              <Select
                value={form.position}
                onChange={e => {
                  const pos = e.target.value
                  f('position')(pos)
                  const medals: Record<string, string> = { '1': 'GOLD', '2': 'SILVER', '3': 'BRONZE' }
                  f('medal')(medals[pos] || 'NONE')
                  f('points')(pos === '1' ? '100' : pos === '2' ? '60' : pos === '3' ? '30' : '10')
                }}
                options={POS_OPT}
              />
            </FormField>

            <FormField label="Alokasi Medali">
              <Select
                value={form.medal}
                onChange={e => f('medal')(e.target.value)}
                options={MEDAL_OPTS}
              />
            </FormField>
          </div>

          <FormField label="Poin Klasemen" hint="Poin yang akan diakumulasikan ke leaderboard kelas tim">
            <Input
              type="number"
              min="0"
              value={form.points}
              onChange={e => f('points')(e.target.value)}
            />
          </FormField>

          {error && <p className="text-xs text-destructive">{error}</p>}
          <SubmitButton loading={saving} label="Simpan Hasil Pertandingan" />
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Hasil Pertandingan"
        message={`Hapus hasil tim "${deleteTarget?.team?.name}" pada cabang ${deleteTarget?.competition?.name}? Poin kelas akan dikurangi secara otomatis.`}
        confirmLabel="Hapus Hasil"
      />
    </div>
  )
}
