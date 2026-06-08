'use client'

import { leaderboard } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Trophy, Medal } from 'lucide-react'

export default function LeaderboardPage() {
  // Transform data for charts
  const chartData = leaderboard.map(item => ({
    kelas: item.kelas,
    points: item.points
  }))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Leaderboard Classmeeting 2026</h1>
        <p className="text-gray-600 mt-2 text-lg">Ranking kelas berdasarkan perolehan poin dan medali</p>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-600" />
          Podium Juara
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 2nd Place */}
          {leaderboard.length > 1 && (
            <div className="md:order-first">
              <div className="rounded-2xl card-premium overflow-hidden border-l-4 border-l-gray-400">
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-1"></div>
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🥈</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{leaderboard[1].kelas}</h3>
                    <p className="text-4xl font-black bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent mb-1">{leaderboard[1].points}</p>
                    <p className="text-sm font-semibold text-gray-600">poin</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          <div className="md:order-none">
            <div className="rounded-2xl card-premium overflow-hidden border-l-4 border-l-yellow-500 ring-2 ring-yellow-300">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2"></div>
              <div className="p-6">
                <div className="text-center">
                  <div className="text-6xl mb-3">🥇</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{leaderboard[0].kelas}</h3>
                  <p className="text-5xl font-black bg-gradient-to-br from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-1">{leaderboard[0].points}</p>
                  <p className="text-sm font-semibold text-gray-600">poin</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          {leaderboard.length > 2 && (
            <div className="md:order-last">
              <div className="rounded-2xl card-premium overflow-hidden border-l-4 border-l-orange-400">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-1"></div>
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🥉</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{leaderboard[2].kelas}</h3>
                    <p className="text-4xl font-black bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">{leaderboard[2].points}</p>
                    <p className="text-sm font-semibold text-gray-600">poin</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Perolehan Poin per Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="kelas" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} poin`} />
                  <Bar dataKey="points" fill="#eab308" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Points Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Medali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((item) => (
                <div key={item.rank} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900">#{item.rank}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.kelas}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">🥇 {item.medals.gold}</span>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">🥈 {item.medals.silver}</span>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">🥉 {item.medals.bronze}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Lengkap</CardTitle>
          <CardDescription>Daftar peringkat kelas berdasarkan perolehan poin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ranking</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kelas</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Emas</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Perak</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Perunggu</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total Poin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((item) => (
                  <tr key={item.rank} className={`hover:bg-gray-50 ${
                    item.rank === 1 ? 'bg-yellow-50' :
                    item.rank === 2 ? 'bg-gray-50' :
                    item.rank === 3 ? 'bg-orange-50' :
                    ''
                  }`}>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        {item.rank === 1 && <span className="text-2xl">🥇</span>}
                        {item.rank === 2 && <span className="text-2xl">🥈</span>}
                        {item.rank === 3 && <span className="text-2xl">🥉</span>}
                        {item.rank > 3 && <span className="font-semibold text-gray-600">#{item.rank}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{item.kelas}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-yellow-600">{item.medals.gold}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-gray-400">{item.medals.silver}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="font-bold text-orange-600">{item.medals.bronze}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-gray-900 text-lg">{item.points}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Info */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Sistem Penilaian</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Medali Emas = 100 poin</p>
          <p>• Medali Perak = 50 poin</p>
          <p>• Medali Perunggu = 25 poin</p>
          <p>• Poin total dihitung dari seluruh kompetisi yang diikuti</p>
        </CardContent>
      </Card>
    </div>
  )
}
