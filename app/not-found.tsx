import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
        <Link href="/">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Kembali ke Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
