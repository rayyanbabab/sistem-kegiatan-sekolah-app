'use client'

import { useState } from 'react'
import { candidates, votingSession } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react'

export default function VotingPage() {
  const { hasVoted, setHasVoted } = useAuth()
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [confirmStep, setConfirmStep] = useState(false)
  const [votingComplete, setVotingComplete] = useState(hasVoted)

  const handleSelectCandidate = (candidateId: string) => {
    if (!hasVoted) {
      setSelectedCandidate(candidateId)
      setConfirmStep(true)
    }
  }

  const handleConfirmVote = () => {
    if (selectedCandidate) {
      setVotingComplete(true)
      setHasVoted(true)
      setConfirmStep(false)
    }
  }

  const handleCancel = () => {
    setConfirmStep(false)
    setSelectedCandidate(null)
  }

  // Status: Voting Closed
  if (votingSession.status === 'closed') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voting Pemilu OSIS 2026</h1>
          <p className="text-gray-600 mt-2">Pilih kandidat yang Anda inginkan untuk menjadi ketua OSIS</p>
        </div>

        <Card className="bg-gray-50 border-gray-300">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Voting Telah Ditutup</h2>
              <p className="text-gray-600">Terima kasih telah berpartisipasi dalam voting Pemilu OSIS 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Status: Already Voted
  if (votingComplete) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Voting Pemilu OSIS 2026</h1>
          <p className="text-gray-600 mt-2">Pilih kandidat yang Anda inginkan untuk menjadi ketua OSIS</p>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-green-900 mb-2">Terima Kasih!</h2>
                <p className="text-green-800">
                  Suara Anda telah berhasil dicatat. Anda tidak dapat mengubah pilihan setelah ini.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => window.location.href = '/dashboard/pemilu/real-count'}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700"
        >
          Lihat Hasil Real Count
        </Button>
      </div>
    )
  }

  // Confirmation Step
  if (confirmStep && selectedCandidate) {
    const selected = candidates.find(c => c.id === selectedCandidate)

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Konfirmasi Pilihan</h1>
          <p className="text-gray-600 mt-2">Yakin dengan pilihan Anda?</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-6 mb-6">
              <div className="w-32 h-32 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src={selected?.photo}
                  alt={selected?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{selected?.name}</h2>
                  <Badge className="bg-purple-100 text-purple-700 font-bold">
                    #{selected?.number}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4">{selected?.kelas}</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Visi Misi:</p>
                  <p className="text-sm text-gray-600">{selected?.visiMisi}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Setelah Anda mengkonfirmasi, pilihan tidak dapat diubah. Pastikan Anda sudah yakin dengan pilihan ini.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Kembali
              </Button>
              <Button
                onClick={handleConfirmVote}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Konfirmasi Pilihan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Voting Step - Select Candidate
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Voting Pemilu OSIS 2026</h1>
        <p className="text-gray-600 mt-2">Pilih kandidat yang Anda inginkan untuk menjadi ketua OSIS</p>
      </div>

      {/* Voting Status */}
      <Card className="mb-6 bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900 mb-2">Status Voting</p>
              <p className="text-sm text-gray-600">
                {votingSession.votedCount} dari {votingSession.totalVoters} siswa telah memilih
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">
                {Math.round((votingSession.votedCount / votingSession.totalVoters) * 100)}%
              </p>
              <p className="text-xs text-gray-600">Partisipasi</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${(votingSession.votedCount / votingSession.totalVoters) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Candidates Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {candidates.map((candidate) => (
          <button
            key={candidate.id}
            onClick={() => handleSelectCandidate(candidate.id)}
            className="text-left"
          >
            <Card className={`hover:shadow-lg transition cursor-pointer ${
              selectedCandidate === candidate.id ? 'border-purple-600 border-2' : ''
            }`}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Photo */}
                  <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                      <Badge className="bg-purple-100 text-purple-700 font-bold text-xs">
                        #{candidate.number}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{candidate.kelas}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{candidate.visiMisi}</p>
                  </div>

                  {/* Selection Indicator */}
                  {selectedCandidate === candidate.id && (
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Important Notes */}
      <Card className="mt-6 bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900 text-base">Peraturan Voting</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>• Voting dilakukan secara anonim dan rahasia</p>
          <p>• Setiap akun hanya bisa memilih satu kali</p>
          <p>• Tidak dapat mengubah pilihan setelah dikonfirmasi</p>
          <p>• Voting akan ditutup pada {new Date(votingSession.endTime).toLocaleString('id-ID')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
