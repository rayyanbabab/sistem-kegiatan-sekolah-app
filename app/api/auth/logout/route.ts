import { NextResponse } from 'next/server'
import { COOKIE_NAME_EXPORT } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true, data: { message: 'Logout berhasil' } })
  response.cookies.set(COOKIE_NAME_EXPORT, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
  return response
}
