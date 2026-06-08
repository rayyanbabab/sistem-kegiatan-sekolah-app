'use client'

import { teams, competitions } from '@/lib/mockData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { Users, CheckCircle, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react'

export default function TeamsPage() {
  const { currentUser } = useAuth()

  // Group teams by status
  const approved = teams.filter(t => t.status === 'approved')
  const registered = teams.filter(t => t.status === 'registered')
  const rejected = teams.filter(t => t.status === 'rejected')

  const getCompetitionName = (compId: string) => {
    return competitions.find(c => c.id === compId)?.name || 'Kompetisi Tidak Diketahui'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'registered':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Disetujui' }
      case 'registered':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Terdaftar' }
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Ditolak' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' }
    }
  }

  const TeamCard = ({ team }: { team: typeof teams[0] }) => {
    const badge = getStatusBadge(team.status)

    return (
      <div className="rounded-2xl card-premium overflow-hidden group">
        <div className={`h-1 ${
          team.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-green-600' :
          team.status === 'registered' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
          'bg-gradient-to-r from-red-500 to-red-600'
        }`}></div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg ${
                team.status === 'approved' ? 'bg-green-100' :
                team.status === 'registered' ? 'bg-yellow-100' :
                'bg-red-100'
              } group-hover:scale-110 smooth-transition`}>
                {getStatusIcon(team.status)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{team.name}</h3>
                <p className="text-sm text-gray-600 font-medium">{getCompetitionName(team.competition)}</p>
              </div>
            </div>
            <Badge className={`${badge.bg} ${badge.text}`}>
              {badge.label}
            </Badge>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Anggota Tim ({team.members.length})</p>
            <div className="space-y-1">
              {team.members.map((member, idx) => (
                <p key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {member}
                </p>
              ))}
            </div>
          </div>

          {currentUser?.role === 'super-admin' || currentUser?.role === 'panitia' ? (
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              {team.status === 'registered' && (
                <>
                  <Button variant="outline" size="sm" className="flex-1 text-green-600 border-green-200 hover:bg-green-50">
                    Setujui
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                    Tolak
                  </Button>
                </>
              )}
              {team.status === 'approved' && (
                <Button variant="outline" size="sm" className="w-full">
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit2 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-3 h-3 mr-1" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Manajemen Tim</h1>
        <p className="text-gray-600 mt-2 text-lg">
          {currentUser?.role === 'super-admin' || currentUser?.role === 'panitia'
            ? 'Verifikasi dan kelola pendaftaran tim'
            : 'Kelola tim kelas Anda'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{approved.length}</p>
              <p className="text-sm text-gray-600">Disetujui</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{registered.length}</p>
              <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{rejected.length}</p>
              <p className="text-sm text-gray-600">Ditolak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approved Teams */}
      {approved.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Tim Disetujui
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approved.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {/* Registered Teams */}
      {registered.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Menunggu Verifikasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registered.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {/* Rejected Teams */}
      {rejected.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Tim Ditolak
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rejected.map(team => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Tidak ada tim</p>
              <p className="text-gray-400 text-sm">Belum ada tim yang terdaftar</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
