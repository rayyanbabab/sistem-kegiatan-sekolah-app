'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LandingPage from './landing/page'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // If logged in, redirect happens automatically
  if (user) {
    return null
  }

  // Show landing page for non-authenticated users
  return <LandingPage />
}
