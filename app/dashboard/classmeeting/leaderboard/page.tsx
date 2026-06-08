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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard Classmeeting 2026</h1>
        <p className="text-gray-600 mt-2">Ranking kelas berdasarkan perolehan poin dan medali</p>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Podium Juara</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 2nd Place */}
          {leaderboard.length > 1 && (
            <div className="md:order-first">
              <Card className="border-2 border-gray-400">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🥈</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{leaderboard[1].kelas}</h3>
                    <p className="text-3xl font-bold text-yellow-600 mb-1">{leaderboard[1].points}</p>
                    <p className="text-sm text-gray-600">poin</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 1st Place */}
          <Card className="border-4 border-yellow-400 md:order-none">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-5xl mb-2">🥇</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{leaderboard[0].kelas}</h3>
                <p className="text-4xl font-bold text-yellow-600 mb-1">{leaderboard[0].points}</p>
                <p className="text-sm text-gray-600">poin</p>
              </div>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          {leaderboard.length > 2 && (
            <div className="md:order-last">
              <Card className="border-2 border-orange-400">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🥉</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{leaderboard[2].kelas}</h3>
                    <p className="text-3xl font-bold text-orange-600 mb-1">{leaderboard[2].points}</p>
                    <p className="text-sm text-gray-600">poin</p>
                  </div>
                </CardContent>
              </Card>
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
