'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, loading } = useAuth()

  const [done, setDone] = useState<string[]>([])

  // 🔐 AUTH GUARD
  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (!loading && user && !userProfile?.profileCompleted) router.push('/complete-profile')
    if (userProfile?.activationCompleted) router.push('/dashboard')
  }, [user, userProfile, loading, router])

  // 🔥 FIXED TASKS (NEVER CHANGE)
  const tasks = [
    { id: 'telegram', title: 'Join Telegram', link: 'https://t.me/bitdeencommunity' },
    { id: 'youtube', title: 'Subscribe YouTube', link: 'https://youtube.com/@bitdeenofficial' },
    { id: 'instagram', title: 'Follow Instagram', link: 'https://instagram.com/bitdeen.official' },
    { id: 'facebook', title: 'Follow Facebook', link: 'https://facebook.com/share/1Db5Dk1K2E/' },
    { id: 'tiktok', title: 'Follow TikTok', link: 'https://www.tiktok.com/@bitdeen.official' },
    { id: 'twitter', title: 'Follow X', link: 'https://x.com/Bitdeenofficial' },
  ]

  // 🚀 OPEN TASK (SAFE)
  const openTask = (task: any) => {
    if (!task?.link) return

    window.open(task.link, '_blank', 'noopener,noreferrer')

    setDone(prev => {
      if (prev.includes(task.id)) return prev
      return [...prev, task.id]
    })
  }

  const allDone = done.length === tasks.length

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">

      <div className="w-full max-w-md bg-gray-900 p-6 rounded-xl">

        <h1 className="text-xl font-bold mb-4 text-center">
          Activate Your Account
        </h1>

        {/* TASK LIST */}
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => openTask(task)}
              className="p-3 bg-gray-800 rounded cursor-pointer flex justify-between hover:bg-gray-700"
            >
              <span>{task.title}</span>
              <span>{done.includes(task.id) ? '✔ Done' : 'Open'}</span>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <button
          disabled={!allDone}
          className={`mt-5 w-full p-3 rounded ${
            allDone ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          Continue to Dashboard
        </button>

      </div>
    </div>
  )
}
