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
import { Loader2 } from 'lucide-react'

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const tasks = [
  { id: 'youtube', title: 'YouTube Subscribe', link: 'https://youtube.com/@Bitdeenofficial' },
  { id: 'facebook', title: 'Facebook Follow', link: 'https://facebook.com/bitdeenofficial1' },
  { id: 'telegram', title: 'Telegram Community', link: 'https://t.me/bitdeencommunity' },
  { id: 'twitter', title: 'Twitter Follow', link: 'https://x.com/Bitdeenofficial' },
  { id: 'instagram', title: 'Instagram Follow', link: 'https://instagram.com/bitdeenofficial' },
  { id: 'tiktok', title: 'TikTok Follow', link: 'https://www.tiktok.com/@bitdeenofficial' },
]

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, loading } = useAuth()

  const [done, setDone] = useState<string[]>([])
  const [taskStart, setTaskStart] = useState<Record<string, number>>({})
  const [claiming, setClaiming] = useState(false)

  // =========================
  // LOAD FIREBASE DATA
  // =========================
  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    const loadUserTasks = async () => {
      try {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const data = snap.data()
          setDone(data.completedTasks || [])
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadUserTasks()
  }, [user, loading])

  // =========================
  // OPEN TASK
  // =========================
  const openTask = (task: any) => {
    if (done.includes(task.id)) return

    window.open(task.link, '_blank', 'noopener,noreferrer')

    setTaskStart((prev) => ({
      ...prev,
      [task.id]: Date.now(),
    }))
  }

  // =========================
  // VERIFY TASK (FIREBASE SAFE)
  // =========================
  const verifyTask = async (id: string) => {
    if (done.includes(id)) return

    const start = taskStart[id]

    if (!start) {
      toast.error('Please open the task first')
      return
    }

    const diff = Date.now() - start

    if (diff < 10000) {
      toast.error('Stay at least 10 seconds')
      return
    }

    try {
      const updated = [...done, id]
      setDone(updated)

      await updateDoc(doc(db, 'users', user.uid), {
        completedTasks: arrayUnion(id),
      })

      toast.success('Task Verified ✔')
    } catch (err) {
      toast.error('Verification failed')
    }
  }

  // =========================
  // CHECK ALL DONE
  // =========================
  const allDone = tasks.every((t) => done.includes(t.id))

  // =========================
  // CLAIM REWARD
  // =========================
  const claimReward = async () => {
    if (!allDone || claiming) return

    setClaiming(true)

    try {
      await createTicket(
        user.uid,
        userProfile?.fullName || 'User',
        userProfile?.phone || '',
        userProfile?.address || '',
        'activation'
      )

      await updateDoc(doc(db, 'users', user.uid), {
        activationCompleted: true,
      })

      toast.success('Activation Completed 🎉')
      router.push('/dashboard')

    } catch (err) {
      toast.error('Claim failed')
    } finally {
      setClaiming(false)
    }
  }

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <ThreeBackgroundSimple />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="https://i.imgur.com/VZmr8Dr.jpeg"
              alt="logo"
              width={80}
              height={80}
              className="rounded-full mb-3"
            />

            <h1 className="text-2xl font-bold">Account Activation</h1>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Complete all tasks to activate your account and get 1 lottery ticket
            </p>
          </div>

          {/* TASK LIST */}
          <div className="space-y-3 mb-6">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="p-3 bg-gray-800 rounded-lg flex justify-between items-center"
              >
                <span>{t.title}</span>

                {done.includes(t.id) ? (
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

          {/* CLAIM BUTTON */}
          <Button
            disabled={!allDone || claiming}
            onClick={claimReward}
            className="w-full"
          >
            {claiming ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Claim Reward'
            )}
          </Button>

        </div>
      </motion.div>
    </div>
  )
}
