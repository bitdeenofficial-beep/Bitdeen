'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { createTicket } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { ThreeBackgroundSimple } from '@/components/three-background'

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, refreshUserProfile, loading } = useAuth()

  const [done, setDone] = useState<string[]>([])
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && !userProfile?.profileCompleted) router.push('/complete-profile')
    if (userProfile?.activationCompleted) router.push('/dashboard')
  }, [user, userProfile, loading, router])

  // ✅ SAFE OPEN FUNCTION
  const openLink = (url: string, id: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')

    if (!done.includes(id)) {
      setDone([...done, id])
      toast.success('Task opened successfully!')
    }
  }

  // 🔥 YOUR SOCIAL TASKS
  const tasks = [
    {
      id: 'telegram',
      title: 'Join Telegram',
      link: 'https://t.me/bitdeencommunity',
    },
    {
      id: 'youtube',
      title: 'Subscribe YouTube',
      link: 'https://youtube.com/@bitdeenofficial?si=EfxY_v-TotKSRvkn',
    },
    {
      id: 'instagram',
      title: 'Follow Instagram',
      link: 'https://www.instagram.com/bitdeen.official?igsh=bDQ3eHFhZjJ6bnQ2',
    },
    {
      id: 'facebook',
      title: 'Follow Facebook',
      link: 'https://www.facebook.com/share/1Db5Dk1K2E/',
    },
    {
      id: 'tiktok',
      title: 'Follow TikTok',
      link: 'https://www.tiktok.com/@bitdeen.official',
    },
    {
      id: 'twitter',
      title: 'Follow X (Twitter)',
      link: 'https://x.com/Bitdeenofficial',
    }
  ]

  const allCompleted = done.length === tasks.length

  // 🎁 CLAIM REWARD
  const claimReward = async () => {
    if (!allCompleted || !userProfile) return

    setClaiming(true)
    try {
      await createTicket(
        userProfile.uid,
        userProfile.fullName || userProfile.displayName,
        userProfile.phone || '',
        userProfile.address || '',
        'activation'
      )

      await updateUserProfile({
        activationCompleted: true,
        completedTasks: (userProfile.completedTasks || 0) + tasks.length,
      })

      await refreshUserProfile()
      toast.success('Activation completed! You got 1 ticket 🎉')
      router.push('/dashboard')

    } catch (e) {
      toast.error('Failed to claim reward')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ThreeBackgroundSimple />

      <div className="w-full max-w-lg bg-black/70 p-6 rounded-2xl border border-gray-700">

        {/* HEADER */}
        <div className="text-center mb-6">
          <Image
            src="https://i.imgur.com/VZmr8Dr.jpeg"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto rounded-full"
          />
          <h1 className="text-xl font-bold mt-3">Activate Your Account</h1>
        </div>

        {/* TASK LIST */}
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => openLink(t.link, t.id)}
              className="p-3 bg-gray-800 rounded-lg cursor-pointer flex justify-between hover:bg-gray-700"
            >
              <span>{t.title}</span>
              <span>{done.includes(t.id) ? '✔ Done' : 'Open'}</span>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-6 text-center">
          <p className="text-sm mb-3">
            Complete all tasks to unlock dashboard
          </p>

          <Button
            disabled={!allCompleted || claiming}
            onClick={claimReward}
            className="w-full"
          >
            {claiming ? 'Processing...' : 'Claim 1 Ticket'}
          </Button>
        </div>

      </div>
    </div>
  )
}
