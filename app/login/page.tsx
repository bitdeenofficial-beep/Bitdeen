'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Ticket, Shield, Gift, Users } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user, userProfile, signInWithGoogle, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user || !userProfile) return

    if (!userProfile.profileCompleted) {
      router.push('/complete-profile')
    } else if (!userProfile.activationCompleted) {
      router.push('/activation')
    } else {
      router.push('/dashboard')
    }
  }, [user, userProfile, loading, router])

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error(err)
    }
  }

  const features = [
    { icon: Ticket, title: 'Earn Tickets', description: 'Complete tasks to earn lottery tickets' },
    { icon: Gift, title: 'Win Prizes', description: 'Amazing prizes in every draw' },
    { icon: Users, title: 'Refer Friends', description: 'Get rewards for referrals' },
    { icon: Shield, title: 'Secure System', description: 'Fair and transparent system' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ThreeBackgroundSimple />

      <div className="max-w-md w-full p-6 bg-white/10 backdrop-blur-xl rounded-2xl">

        <div className="text-center mb-6">
          <Image
            src="https://i.imgur.com/VZmr8Dr.jpeg"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto rounded-full"
          />
          <h1 className="text-2xl font-bold mt-3">BitDeen</h1>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {features.map((f, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-lg text-center">
              <f.icon className="w-5 h-5 mx-auto mb-1" />
              <p className="text-sm font-medium">{f.title}</p>
            </div>
          ))}
        </div>

        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-12"
        >
          {loading ? 'Loading...' : 'Continue with Google'}
        </Button>

      </div>
    </div>
  )
}
