'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LandingPage from './landing/page'

export default function Home() {
  const { currentUser, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // If logged in, redirect happens automatically
  if (isAuthenticated) {
    return null
  }

  // Show landing page for non-authenticated users
  return <LandingPage />
}
