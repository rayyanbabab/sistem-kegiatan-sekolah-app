import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './auth'

type Role = 'SUPER_ADMIN' | 'PANITIA' | 'KANDIDAT' | 'KETUA_KELAS' | 'SISWA'

// Standard success response
export function ok(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

// Standard error response
export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

// Auth guard middleware - checks session and optionally checks allowed roles
export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getSession()
  if (!session) {
    return { error: err('Unauthorized - silakan login', 401), session: null }
  }
  if (allowedRoles && !allowedRoles.includes(session.role as Role)) {
    return { error: err('Forbidden - akses tidak diizinkan', 403), session: null }
  }
  return { error: null, session }
}

// Parse JSON body safely
export async function parseBody<T>(req: NextRequest): Promise<{ data: T | null; error: NextResponse | null }> {
  try {
    const data = await req.json() as T
    return { data, error: null }
  } catch {
    return { data: null, error: err('Body request tidak valid (JSON required)') }
  }
}
