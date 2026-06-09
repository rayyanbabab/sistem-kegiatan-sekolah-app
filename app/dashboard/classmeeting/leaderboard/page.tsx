'use client'

import { Trophy, Medal, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const LEADERBOARD = [
  { rank: 1, kelas: 'XII IPA 1', points: 225, medals: { gold: 2, silver: 1, bronze: 0 } },
  { rank: 2, kelas: 'XII IPS 1', points: 175, medals: { gold: 1, silver: 1, bronze: 1 } },
  { rank: 3, kelas: 'XII IPA 2', points: 150, medals: { gold: 1, silver: 0, bronze: 2 } },
  { rank: 4, kelas: 'XI IPA 1', points: 100, medals: { gold: 0, silver: 2, bronze: 0 } },
  { rank: 5, kelas: 'XI IPS 2', points: 75, medals: { gold: 0, silver: 1, bronze: 1 } },
  { rank: 6, kelas: 'X IPA 3', points: 25, medals: { gold: 0, silver: 0, bronze: 1 } },
]

const BAR_COLORS = ['#F59E0B', '#94A3B8', '#F97316', '#60A5FA', '#A78BFA', '#34D399']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl p-3 border border-white/20 shadow-2xl">
        <p className="text-white font-semibold text-sm">{label}</p>
        <p className="text-amber-400 font-bold">{payload[0].value} poin</p>
      </div>
    )
  }
  return null
}

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className="w-6 h-6 rounded-full bg-amber-500/30 text-amber-400 font-black text-xs flex items-center justify-center">1</span>
  if (rank === 2) return <span className="w-6 h-6 rounded-full bg-slate-400/30 text-slate-300 font-black text-xs flex items-center justify-center">2</span>
  if (rank === 3) return <span className="w-6 h-6 rounded-full bg-orange-500/30 text-orange-400 font-black text-xs flex items-center justify-center">3</span>
  return <span className="text-sm font-semibold text-white/40">#{rank}</span>
}

export default function LeaderboardPage() {
  const podiumOrder = [LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].filter(Boolean)
  const podiumHeight = ['h-24', 'h-32', 'h-20']
  const podiumColors = [
    'from-slate-400 to-slate-500',
    'from-amber-400 to-yellow-500',
    'from-orange-400 to-amber-600',
  ]
  const podiumRankColors = ['text-slate-300', 'text-amber-300', 'text-orange-300']

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-400 font-medium uppercase tracking-wider">Classmeeting 2026</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Leaderboard Kelas</h1>
        <p className="text-white/40 mt-1">Ranking berdasarkan perolehan poin dan medali</p>
      </div>

      {/* Podium */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Trophy className="w-4 h-4 text-amber-400/60" />
          <p className="text-sm font-semibold text-white/50 uppercase tracking-wider">Podium Juara</p>
        </div>
        <div className="flex items-end justify-center gap-3">
          {podiumOrder.map((item, i) => (
            <div key={item.kelas} className="flex flex-col items-center gap-2 flex-1 max-w-[140px]">
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${podiumColors[i]} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <span className={`text-lg font-black ${podiumRankColors[i]}`}>{podiumOrder[i].rank}</span>
                </div>
                <p className="text-sm font-bold text-white">{item.kelas}</p>
                <p className="text-xs text-white/40">{item.points} poin</p>
              </div>
              <div className={`w-full ${podiumHeight[i]} bg-gradient-to-b ${podiumColors[i]} rounded-t-xl flex items-center justify-center opacity-80`}>
                <span className="text-2xl font-black text-white/30">#{item.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart + Medal Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-white text-sm">Perolehan Poin per Kelas</h3>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEADERBOARD} margin={{ bottom: 20 }}>
                <XAxis
                  dataKey="kelas"
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                  {LEADERBOARD.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-4 h-4 text-white/40" />
            <h3 className="font-semibold text-white text-sm">Distribusi Medali</h3>
          </div>
          <div className="space-y-3">
            {LEADERBOARD.map((item) => (
              <div key={item.rank} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  item.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                  item.rank === 2 ? 'bg-slate-400/20 text-slate-400' :
                  item.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-white/[0.05] text-white/40'
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.kelas}</p>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-lg font-medium">Emas {item.medals.gold}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-400/10 text-slate-400 rounded-lg font-medium">Perak {item.medals.silver}</span>
                    <span className="text-xs px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-lg font-medium">Perunggu {item.medals.bronze}</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-white">{item.points}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-semibold text-white text-sm">Ranking Lengkap</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Rank', 'Kelas', 'Emas', 'Perak', 'Perunggu', 'Total Poin'].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider ${i === 0 || i >= 2 ? 'text-center' : 'text-left'} ${i === 5 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((item) => (
                <tr key={item.rank} className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition ${item.rank <= 3 ? 'bg-white/[0.02]' : ''}`}>
                  <td className="px-4 py-4 text-center">
                    <RankBadge rank={item.rank} />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white text-sm">{item.kelas}</p>
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-amber-400">{item.medals.gold}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-400">{item.medals.silver}</td>
                  <td className="px-4 py-4 text-center font-bold text-orange-400">{item.medals.bronze}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-lg font-bold text-white">{item.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring system */}
      <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <p className="text-sm font-semibold text-blue-400">Sistem Penilaian</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Emas', pts: '100 poin', color: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400' },
            { label: 'Perak', pts: '50 poin', color: 'text-slate-400', bg: 'bg-slate-400/10', dot: 'bg-slate-400' },
            { label: 'Perunggu', pts: '25 poin', color: 'text-orange-400', bg: 'bg-orange-500/10', dot: 'bg-orange-400' },
          ].map(s => (
            <div key={s.label} className={`p-3 rounded-xl ${s.bg}`}>
              <div className={`w-4 h-4 rounded-full ${s.dot} mx-auto mb-2`} />
              <p className={`text-xs font-semibold ${s.color} mb-0.5`}>{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.pts}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
