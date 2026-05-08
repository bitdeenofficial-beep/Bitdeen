'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { createTicket } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { toast } from 'sonner'
import { Ticket, Loader2 } from 'lucide-react'

const ACTIVATION_KEY = 'bitdeen_activation_done_v1'

const activationTasks = [
  {
    id: 'youtube',
    title: 'Subscribe YouTube',
    url: 'https://www.youtube.com/@Bitdeenofficial',
  },
  {
    id: 'facebook',
    title: 'Follow Facebook',
    url: 'https://www.facebook.com/bitdeenofficial1',
  },
  {
    id: 'telegram',
    title: 'Join Telegram Community',
    url: 'https://t.me/bitdeencommunity',
  },
  {
    id: 'twitter',
    title: 'Follow X (Twitter)',
    url: 'https://x.com/Bitdeenofficial',
  },
  {
    id: 'instagram',
    title: 'Follow Instagram',
    url: 'https://www.instagram.com/bitdeenofficial/',
  },
  {
    id: 'tiktok',
    title: 'Follow TikTok',
    url: 'https://www.tiktok.com/@bitdeenofficial',
  },
]

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, refreshUserProfile, loading } = useAuth()

  const [completed, setCompleted] = useState<string[]>([])
  const [claiming, setClaiming] = useState(false)

  // 🔒 redirect logic
  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && !userProfile?.profileCompleted) router.push('/complete-profile')

    const done = localStorage.getItem(ACTIVATION_KEY)
    if (done === 'true') router.push('/dashboard')
  }, [user, userProfile, loading, router])

  // 🔗 safe open
  const openTask = (task: any) => {
    const win = window.open(task.url, '_blank', 'noopener,noreferrer')

    if (!win) {
      // fallback for blocked popup
      window.location.href = task.url
    }

    if (!completed.includes(task.id)) {
      setCompleted((prev) => [...prev, task.id])
      toast.success('Task opened. Please complete and return.')
    }
  }

  const allDone = completed.length === activationTasks.length

  // 🎁 CLAIM REWARD (only once)
  const claimReward = async () => {
    if (!allDone || !userProfile) return

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
        completedTasks: (userProfile.completedTasks || 0) + activationTasks.length,
      })

      await refreshUserProfile()

      localStorage.setItem(ACTIVATION_KEY, 'true')

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
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
          <p className="text-sm text-gray-400">
            Complete all tasks to unlock dashboard
          </p>
        </div>

        {/* TASKS */}
        <div className="space-y-3">
          {activationTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => openTask(task)}
              className="p-3 bg-gray-800 rounded-lg cursor-pointer flex justify-between hover:bg-gray-700 transition"
            >
              <span>{task.title}</span>
              <span className="text-sm text-yellow-400">Open</span>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-6 text-center">
          <p className="text-sm mb-3 text-gray-400">
            {completed.length}/{activationTasks.length} completed
          </p>

          <Button
            disabled={!allDone || claiming}
            onClick={claimReward}
            className="w-full"
          >
            {claiming ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Ticket className="w-4 h-4 mr-2" />
                Claim 1 Ticket
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}
