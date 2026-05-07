'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Navbar, DashboardSidebar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Loader2 } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, userProfile, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!userProfile?.profileCompleted) {
        router.push('/complete-profile')
      } else if (!userProfile?.activationCompleted) {
        router.push('/activation')
      }
    }
  }, [user, userProfile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !userProfile?.profileCompleted || !userProfile?.activationCompleted) {
    return null
  }

  return (
    <div className="min-h-screen flex islamic-pattern">
      <ThreeBackgroundSimple />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
