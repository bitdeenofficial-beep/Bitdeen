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
import { Loader2, Ticket } from 'lucide-react'

const STORAGE_KEY = 'bitdeen_activation_tasks'

const activationTasks = [
  {
    id: 'youtube',
    title: 'YouTube Subscribe',
    link: 'https://www.youtube.com/@Bitdeenofficial',
  },
  {
    id: 'facebook',
    title: 'Facebook Follow',
    link: 'https://www.facebook.com/bitdeenofficial1',
  },
  {
    id: 'telegram',
    title: 'Join Community',
    link: 'https://t.me/bitdeencommunity',
  },
  {
    id: 'twitter',
    title: 'Follow Twitter',
    link: 'https://x.com/Bitdeenofficial',
  },
  {
    id: 'instagram',
    title: 'Follow Instagram',
    link: 'https://www.instagram.com/bitdeenofficial',
  },
  {
    id: 'tiktok',
    title: 'Follow TikTok',
    link: 'https://www.tiktok.com/@bitdeenofficial',
  },
]

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, refreshUserProfile, loading } = useAuth()

  const [completed, setCompleted] = useState<string[]>([])
  const [claiming, setClaiming] = useState(false)

  // 🔥 Load saved progress (NO RESET AFTER LOGOUT)
  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && !userProfile?.profileCompleted) router.push('/complete-profile')

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setCompleted(JSON.parse(saved))
  }, [user, userProfile, loading])

  const openTask = (task: any) => {
    if (completed.includes(task.id)) return

    // try open in app
    window.open(task.link, '_blank', 'noopener,noreferrer')
  }

  const verifyTask = (id: string) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev

      const updated = [...prev, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

      toast.success('Task Verified!')
      return updated
    })
  }

  const allDone = completed.length === activationTasks.length

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
      })

      await refreshUserProfile()

      toast.success('Activation Completed! 🎉')
      router.push('/dashboard')

    } catch {
      toast.error('Error claiming reward')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ThreeBackgroundSimple />

      <div className="w-full max-w-lg bg-black/70 p-6 rounded-2xl border border-gray-700">

        {/* Header */}
        <div className="text-center mb-6">
          <Image
            src="https://i.imgur.com/VZmr8Dr.jpeg"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto rounded-full"
          />
          <h1 className="text-xl font-bold mt-3">Activate Account</h1>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {activationTasks.map((t) => (
            <div key={t.id} className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">

              <span>{t.title}</span>

              {completed.includes(t.id) ? (
                <span className="text-green-400">✔ Done</span>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => openTask(t)}>
                    Open
                  </Button>
                  <Button size="sm" onClick={() => verifyTask(t.id)}>
                    Verify
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Claim */}
        <div className="mt-6">
          <Button
            disabled={!allDone || claiming}
            onClick={claimReward}
            className="w-full"
          >
            {claiming ? <Loader2 className="animate-spin" /> : 'Claim Ticket'}
          </Button>
        </div>

      </div>
    </div>
  )
}
