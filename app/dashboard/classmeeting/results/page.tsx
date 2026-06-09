'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy, Star, Medal, RefreshCw, Plus, Trash2 } from 'lucide-react'
import { Modal, ConfirmDialog, FormField, Select, SubmitButton } from '@/components/ui/crud'

interface Result {
  id: string; position: number; points: number; medal: string | null
  team: { id: string; name: string; kelas: string }
  competition: { id: string; name: string; category: string }
}
interface Team   { id: string; name: string; kelas: string; competition: { id: string; name: string } }
interface Competition { id: string; name: string; category: string }

const MEDAL_OPTS = [
  { value: 'GOLD', label: '🥇 Juara 1 (Gold)' }, { value: 'SILVER', label: '🥈 Juara 2 (Silver)' },
  { value: 'BRONZE', label: '🥉 Juara 3 (Bronze)' }, { value: 'NONE', label: 'Tanpa Medali' },
]
const CAT_ICON: Record<string, string> = { OLAHRAGA: '⚽', AKADEMIK: '🎤', SENI: '🎨' }
const CAT_GRAD: Record<string, string> = { OLAHRAGA: 'from-blue-500 to-cyan-500', AKADEMIK: 'from-violet-500 to-purple-500', SENI: 'from-amber-500 to-yellow-500' }
const MEDAL_ICON: Record<string, string> = { GOLD: '🥇', SILVER: '🥈', BRONZE: '🥉', NONE: '' }

const EMPTY = { competitionId: '', teamId: '', position: '1', points: '100', medal: 'GOLD' }

export default function ResultsPage() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'PANITIA'

  const [results, setResults]         = useState<Result[]>([])
  const [teams, setTeams]             = useState<Team[]>([])
  const [comps, setComps]             = useState<Competition[]>([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [deleting, setDeleting]       = useState(false)
  const [showModal, setShowModal]     = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Result | null>(null)
  const [form, setForm]               = useState(EMPTY)
  const [error, setError]             = useState('')

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

  const openCreate = () => { setForm({ ...EMPTY, competitionId: comps[0]?.id || '' }); setError(''); setShowModal(true) }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!form.competitionId || !form.teamId) { setError('Kompetisi dan tim wajib dipilih'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/results', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ competitionId: form.competitionId, teamId: form.teamId, position: parseInt(form.position), points: parseInt(form.points), medal: form.medal }),
      })
      const json = await res.json()
      if (json.success) { setShowModal(false); fetchData() }
      else setError(json.error || 'Gagal menyimpan hasil')
    } catch { setError('Gagal terhubung ke server') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return; setDeleting(true)
    try {
      await fetch(`/api/results/${deleteTarget.id}`, { method: 'DELETE', credentials: 'include' })
      setDeleteTarget(null); fetchData()
    } catch { }
    setDeleting(false)
  }

  const f = (k: string) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  // Group by competition
  const byComp: Record<string, Result[]> = {}
  results.forEach(r => { if (!byComp[r.competition.id]) byComp[r.competition.id] = []; byComp[r.competition.id].push(r) })
  Object.values(byComp).forEach(arr => arr.sort((a, b) => a.position - b.position))

  // Teams filtered by selected competition
  const filteredTeams = form.competitionId ? teams.filter(t => t.competition?.id === form.competitionId) : teams
  const compOpts = comps.map(c => ({ value: c.id, label: c.name }))
  const teamOpts = filteredTeams.map(t => ({ value: t.id, label: `${t.name} (${t.kelas})` }))

  const POS_OPT = [
    { value: '1', label: '🥇 Juara 1' }, { value: '2', label: '🥈 Juara 2' },
    { value: '3', label: '🥉 Juara 3' }, { value: '4', label: 'Posisi 4' }, { value: '5', label: 'Posisi 5' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1"><Trophy className="w-4 h-4 text-amber-400" /><span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting</span></div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Hasil Pertandingan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{results.length} hasil tercatat</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="px-3 py-2 rounded-xl text-xs transition" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-muted)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isAdmin && (
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Input Hasil
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="glass-card rounded-2xl h-48 animate-pulse" style={{ background: 'var(--subtle-bg)' }} />)}</div>
      ) : results.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
          <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Belum ada hasil pertandingan</p>
          {isAdmin && <button onClick={openCreate} className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 transition">Input Hasil Pertama</button>}
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Kompetisi Selesai', value: Object.keys(byComp).length, color: 'from-amber-500 to-orange-400', icon: Trophy },
              { label: 'Medali Emas', value: results.filter(r => r.medal === 'GOLD').length, color: 'from-yellow-500 to-amber-400', icon: Star },
              { label: 'Total Hasil', value: results.length, color: 'from-blue-500 to-cyan-400', icon: Medal },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}><s.icon className="w-5 h-5 text-white" /></div>
                <div><p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p><p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p></div>
              </div>
            ))}
          </div>

          {/* By competition */}
          <div className="grid md:grid-cols-2 gap-5">
            {Object.values(byComp).map(compResults => {
              const comp = compResults[0].competition
              const grad = CAT_GRAD[comp.category] || 'from-blue-500 to-violet-500'
              const icon = CAT_ICON[comp.category] || '🏆'
              return (
                <div key={comp.id} className="glass-card rounded-2xl overflow-hidden">
                  <div className={`h-1.5 bg-gradient-to-r ${grad}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{icon}</span>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{comp.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {compResults.map(r => (
                        <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl group hover:bg-white/[0.03] transition" style={{ background: 'var(--subtle-bg)' }}>
                          <span className="text-lg w-7 text-center flex-shrink-0">{r.medal && MEDAL_ICON[r.medal] || `#${r.position}`}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{r.team.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{r.team.kelas} · {r.points} pts</p>
                          </div>
                          {isAdmin && (
                            <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-red-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Input Hasil Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Input Hasil Pertandingan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Kompetisi" required>
            <Select value={form.competitionId} onChange={e => { f('competitionId')(e.target.value); f('teamId')('') }} options={compOpts} placeholder="Pilih kompetisi..." />
          </FormField>
          <FormField label="Tim" required>
            <Select value={form.teamId} onChange={e => f('teamId')(e.target.value)} options={teamOpts} placeholder={form.competitionId ? 'Pilih tim...' : 'Pilih kompetisi dulu'} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Posisi">
              <Select value={form.position} onChange={e => {
                const pos = e.target.value
                f('position')(pos)
                const medals: Record<string, string> = { '1': 'GOLD', '2': 'SILVER', '3': 'BRONZE' }
                f('medal')(medals[pos] || 'NONE')
                f('points')(pos === '1' ? '100' : pos === '2' ? '75' : pos === '3' ? '50' : '25')
              }} options={POS_OPT} />
            </FormField>
            <FormField label="Medali">
              <Select value={form.medal} onChange={e => f('medal')(e.target.value)} options={MEDAL_OPTS} />
            </FormField>
          </div>
          <FormField label="Poin" hint="Poin untuk leaderboard kelas">
            <input type="number" min="0" value={form.points} onChange={e => f('points')(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-blue-500/40"
              style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-primary)' }} />
          </FormField>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <SubmitButton loading={saving} label="Simpan Hasil" />
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting}
        title="Hapus Hasil" message={`Hapus hasil ${deleteTarget?.team?.name} dari ${deleteTarget?.competition?.name}?`} />
    </div>
  )
}
