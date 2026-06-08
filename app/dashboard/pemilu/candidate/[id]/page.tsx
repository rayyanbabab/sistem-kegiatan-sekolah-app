'use client'

import { candidates } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, BarChart3 } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function CandidateDetailPage() {
  const params = useParams()
  const candidateId = params.id as string
  const candidate = candidates.find(c => c.id === candidateId)

  if (!candidate) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <p className="text-gray-600 font-medium text-lg">Kandidat Tidak Ditemukan</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link href="/dashboard/pemilu/candidates">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Kandidat
        </Button>
      </Link>

      {/* Main Info */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-6">
            {/* Photo */}
            <div className="w-40 h-40 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                <Badge className="bg-purple-100 text-purple-700 font-bold text-lg">
                  #{candidate.number}
                </Badge>
              </div>

              <p className="text-lg text-gray-600 mb-4">{candidate.kelas}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{candidate.votes}</p>
                  <p className="text-xs text-gray-600">Suara</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">35%</p>
                  <p className="text-xs text-gray-600">Persentase</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">#1</p>
                  <p className="text-xs text-gray-600">Ranking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Sukai
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan
            </Button>
            <Link href="/dashboard/pemilu/voting" className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Pilih Kandidat Ini
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Visi Misi */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Visi dan Misi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            {candidate.visiMisi}
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-900">
              <strong>Visi:</strong> Menciptakan OSIS yang lebih responsif terhadap kebutuhan siswa dengan mengedepankan transparansi dan akuntabilitas dalam setiap keputusan.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Program Kerja */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Program Kerja</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📚</span>
              <div>
                <p className="font-medium text-gray-900">Program Akademik</p>
                <p className="text-sm text-gray-600">Peningkatan fasilitas belajar dan program mentoring</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🎭</span>
              <div>
                <p className="font-medium text-gray-900">Program Seni dan Budaya</p>
                <p className="text-sm text-gray-600">Revitalisasi kegiatan seni untuk mengembangkan bakat siswa</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🤝</span>
              <div>
                <p className="font-medium text-gray-900">Program Sosial</p>
                <p className="text-sm text-gray-600">Kegiatan sosial dan gotong royong untuk masyarakat</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">💻</span>
              <div>
                <p className="font-medium text-gray-900">Program Digital</p>
                <p className="text-sm text-gray-600">Modernisasi sistem informasi dan komunikasi OSIS</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Video */}
      {candidate.campaignVideo && candidate.campaignVideo !== '#' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Video Kampanye</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Video Kampanye</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voting Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Voting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Perolehan Suara</span>
                <span className="text-sm font-bold text-gray-900">{candidate.votes}/450</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(candidate.votes / 450) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((candidate.votes / 450) * 100)}%
              </p>
              <p className="text-xs text-gray-600">dari total suara</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
