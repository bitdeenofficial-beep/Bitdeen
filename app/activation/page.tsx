'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { createTicket } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, refreshUserProfile, loading } = useAuth()

  // 🔐 FIXED STATES
  const [openedTasks, setOpenedTasks] = useState<string[]>([])
  const [claiming, setClaiming] = useState(false)

  // 🔐 AUTH GUARD (SAFE)
  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (user && userProfile && !userProfile.profileCompleted) {
      router.push('/complete-profile')
      return
    }

    if (userProfile?.activationCompleted) {
      router.push('/dashboard')
      return
    }
  }, [user, userProfile, loading, router])

  // 🔥 FIXED 6 TASKS (STATIC)
  const tasks = [
    { id: 'telegram', title: 'Join Telegram', link: 'https://t.me/bitdeencommunity' },
    { id: 'youtube', title: 'Subscribe YouTube', link: 'https://youtube.com/@bitdeenofficial' },
    { id: 'instagram', title: 'Follow Instagram', link: 'https://instagram.com/bitdeen.official' },
    { id: 'facebook', title: 'Follow Facebook', link: 'https://facebook.com/share/1Db5Dk1K2E/' },
    { id: 'tiktok', title: 'Follow TikTok', link: 'https://www.tiktok.com/@bitdeen.official' },
    { id: 'twitter', title: 'Follow X', link: 'https://x.com/Bitdeenofficial' },
  ]

  // 🚀 OPEN ONLY (NO FAKE COMPLETE)
  const openTask = (task: any) => {
    window.open(task.link, '_blank', 'noopener,noreferrer')

    setOpenedTasks(prev => {
      if (prev.includes(task.id)) return prev
      return [...prev, task.id]
    })
  }

  // 🧠 ONLY VALID IF ALL OPENED
  const allOpened = openedTasks.length === tasks.length

  // 🎁 FINAL COMPLETE (SERVER SAFE)
  const handleContinue = async () => {
    if (!allOpened || !userProfile) {
      toast.error('Complete all tasks first')
      return
    }

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

      toast.success('Activation Completed 🎉')
      router.push('/dashboard')

    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">

      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl border border-gray-700">

        {/* HEADER (UNCHANGED UI) */}
        <div className="text-center mb-6">
          <Image
            src="https://i.imgur.com/VZmr8Dr.jpeg"
            alt="logo"
            width={80}
            height={80}
            className="mx-auto rounded-full"
          />
          <h1 className="text-xl font-bold mt-3">
            Activate Your Account
          </h1>
          <p className="text-gray-400 text-sm">
            Complete all tasks to unlock dashboard
          </p>
        </div>

        {/* TASKS UI (UNCHANGED STYLE) */}
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => openTask(task)}
              className="p-3 bg-gray-800 rounded-lg cursor-pointer flex justify-between hover:bg-gray-700"
            >
              <span>{task.title}</span>
              <span className="text-sm">
                {openedTasks.includes(task.id) ? '✔ Opened' : 'Open'}
              </span>
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div className="mt-4 text-center text-sm text-gray-400">
          {openedTasks.length} / {tasks.length} Opened
        </div>

        {/* CONTINUE BUTTON (FIXED) */}
        <Button
          disabled={!allOpened || claiming}
          onClick={handleContinue}
          className="w-full mt-5"
        >
          {claiming ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            'Continue'
          )}
        </Button>

      </div>
    </div>
  )
}
