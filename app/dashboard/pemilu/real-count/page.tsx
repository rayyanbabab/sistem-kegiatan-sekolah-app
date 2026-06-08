'use client'

import { candidates, votingSession } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Clock } from 'lucide-react'

export default function RealCountPage() {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)
  const totalVotes = sortedCandidates.reduce((sum, c) => sum + c.votes, 0)

  // Data untuk chart
  const chartData = sortedCandidates.map(c => ({
    name: `${c.number}. ${c.name.split(' ')[0]}`,
    votes: c.votes,
    percentage: Math.round((c.votes / totalVotes) * 100)
  }))

  const COLORS = ['#9333ea', '#7c3aed', '#6d28d9', '#5b21b6']

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Real Count Pemilu OSIS 2026</h1>
        <p className="text-gray-600 mt-2">Hasil voting real-time yang diperbarui secara berkala</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Pemilih</p>
                <p className="text-2xl font-bold text-gray-900">{votingSession.totalVoters}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sudah Memilih</p>
                <p className="text-2xl font-bold text-gray-900">{votingSession.votedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Partisipasi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((votingSession.votedCount / votingSession.totalVoters) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Perolehan Suara per Kandidat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} suara`} />
                  <Bar dataKey="votes" fill="#9333ea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Suara (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} suara`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Perolehan Suara</CardTitle>
          <CardDescription>Ranking kandidat berdasarkan jumlah suara</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Ranking</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nomor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kelas</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Suara</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Persentase</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Grafik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedCandidates.map((candidate, index) => {
                  const percentage = Math.round((candidate.votes / totalVotes) * 100)
                  return (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          {index > 2 && <span className="font-semibold text-gray-600">#{index + 1}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className="bg-purple-100 text-purple-700 font-bold">
                          {candidate.number}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{candidate.name}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {candidate.kelas}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-bold text-gray-900">{candidate.votes}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium text-purple-600">{percentage}%</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="w-32 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Informasi Real Count</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Data real count diperbarui setiap saat ada suara masuk</p>
          <p>• Voting dilakukan secara anonim untuk menjaga integritas hasil</p>
          <p>• Setiap suara hanya dihitung satu kali per akun</p>
          <p>• Hasil akhir akan diumumkan setelah voting ditutup</p>
        </CardContent>
      </Card>
    </div>
  )
}
