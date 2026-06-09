'use client'

import { BarChart3, Users, TrendingUp, Clock, Vote } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts'

const CANDIDATES = [
  { id: '1', number: 1, name: 'Siti Nurhaliza', kelas: 'XII IPA 1', votes: 147, color: '#60A5FA' },
  { id: '2', number: 2, name: 'Budi Santoso',   kelas: 'XII IPS 2', votes: 98,  color: '#A78BFA' },
  { id: '3', number: 3, name: 'Rina Puspita',   kelas: 'XII IPA 2', votes: 73,  color: '#F472B6' },
  { id: '4', number: 4, name: 'Hendra Wijaya',  kelas: 'XII IPA 3', votes: 56,  color: '#FB923C' },
]

const TOTAL_VOTERS = 450
const totalVotes = CANDIDATES.reduce((s, c) => s + c.votes, 0)
const participation = totalVotes > 0 ? Math.round((totalVotes / TOTAL_VOTERS) * 100) : 0

const chartData = CANDIDATES.map(c => ({
  name: `#${c.number} ${c.name.split(' ')[0]}`,
  votes: c.votes,
  pct: totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0,
  color: c.color,
}))


const CustomBarTip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div className="glass-card rounded-xl p-3 border border-white/20 shadow-2xl text-sm">
    <p className="text-white font-semibold">{label}</p>
    <p style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].value} suara</p>
  </div>
) : null

const CustomPieTip = ({ active, payload }: any) => active && payload?.length ? (
  <div className="glass-card rounded-xl p-3 border border-white/20 shadow-2xl text-sm">
    <p className="text-white font-semibold">{payload[0].name}</p>
    <p style={{ color: payload[0].payload.color }} className="font-bold">{payload[0].value} suara ({payload[0].payload.pct}%)</p>
  </div>
) : null

export default function RealCountPage() {
  const sorted = [...CANDIDATES].sort((a, b) => b.votes - a.votes)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Vote className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">Pemilu OSIS 2026</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Real Count Voting</h1>
            <p className="text-white/40 mt-1">Hasil voting real-time yang diperbarui secara berkala</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Total Pemilih', value: TOTAL_VOTERS, color: 'from-blue-500 to-blue-400' },
          { icon: TrendingUp, label: 'Sudah Memilih', value: totalVotes, color: 'from-green-500 to-emerald-400' },
          { icon: Clock, label: 'Partisipasi', value: `${participation}%`, color: 'from-violet-500 to-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-white/50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-white/50">Progress Partisipasi</span>
          <span className="font-semibold text-white">{participation}%</span>
        </div>
        <div className="w-full bg-white/[0.06] rounded-full h-3">
          <div
            className="bg-gradient-to-r from-violet-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${participation}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">{totalVotes} dari {TOTAL_VOTERS} siswa telah memberikan suara</p>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-white text-sm">Perolehan Suara per Kandidat</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={45} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTip />} />
                <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Vote className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-white text-sm">Distribusi Suara (%)</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="votes" nameKey="name" label={e => e.pct > 0 ? `${e.pct}%` : ''} labelLine={false}>
                  {chartData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.85} />)}
                </Pie>
                <Tooltip content={<CustomPieTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {totalVotes === 0 && (
            <p className="text-center text-white/20 text-sm -mt-4">Belum ada suara masuk</p>
          )}
        </div>
      </div>

      {/* Result table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-white text-sm">Detail Perolehan Suara</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Rank', 'No', 'Nama Kandidat', 'Kelas', 'Suara', '%', 'Progress'].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider ${i <= 1 ? 'text-center' : i >= 4 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => {
                const pct = totalVotes > 0 ? Math.round((c.votes / totalVotes) * 100) : 0
                return (
                  <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition">
                    <td className="px-4 py-4 text-center text-sm">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span className="text-white/30">#{i+1}</span>}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: `${c.color}20`, color: c.color }}>
                        #{c.number}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                        <span className="font-medium text-white text-sm">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-white/40">{c.kelas}</td>
                    <td className="px-4 py-4 text-right font-bold text-white">{c.votes}</td>
                    <td className="px-4 py-4 text-right font-semibold" style={{ color: c.color }}>{pct}%</td>
                    <td className="px-4 py-4 text-right">
                      <div className="w-28 h-2 bg-white/[0.06] rounded-full overflow-hidden ml-auto">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.color }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
        <p className="text-sm font-semibold text-blue-400 mb-3">ℹ️ Informasi Real Count</p>
        <ul className="space-y-1.5 text-sm text-white/50">
          <li>• Data real count diperbarui setiap saat ada suara masuk</li>
          <li>• Voting dilakukan secara anonim untuk menjaga integritas</li>
          <li>• Setiap suara hanya dihitung satu kali per akun</li>
          <li>• Hasil akhir akan diumumkan setelah voting ditutup</li>
        </ul>
      </div>
    </div>
  )
}
