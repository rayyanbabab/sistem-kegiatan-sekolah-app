import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'sistem-kegiatan-sekolah-secret-key-2026'
const COOKIE_NAME = 'auth-token'

export interface JWTPayload {
  userId: string
  nis: string
  role: string
}

// Sign JWT token
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// Get current session from cookies (Server Component / Route Handler)
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

// Get current user from DB based on session
export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      nis: true,
      name: true,
      role: true,
      kelas: true,
      avatar: true,
      createdAt: true,
    },
  })
  return user
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME
