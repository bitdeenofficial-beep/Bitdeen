'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { createTicket } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { ActivationTaskCard } from '@/components/task-card'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { toast } from 'sonner'
import { 
  CheckCircle2, 
  Ticket, 
  Loader2,
  Gift,
  Sparkles
} from 'lucide-react'

const activationTasks = [
  {
    id: 'youtube',
    platform: 'youtube',
    title: 'Subscribe to YouTube',
    link: 'https://youtube.com/@bitdeen',
  },
  {
    id: 'facebook',
    platform: 'facebook',
    title: 'Follow on Facebook',
    link: 'https://facebook.com/bitdeen',
  },
  {
    id: 'telegram',
    platform: 'telegram',
    title: 'Join Telegram Group',
    link: 'https://t.me/bitdeen',
  },
  {
    id: 'twitter',
    platform: 'twitter',
    title: 'Follow on Twitter',
    link: 'https://twitter.com/bitdeen',
  },
  {
    id: 'instagram',
    platform: 'instagram',
    title: 'Follow on Instagram',
    link: 'https://instagram.com/bitdeen',
  },
]

export default function ActivationPage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, refreshUserProfile, loading: authLoading } = useAuth()
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    if (!authLoading && user && !userProfile?.profileCompleted) {
      router.push('/complete-profile')
    }
    if (userProfile?.activationCompleted) {
      router.push('/dashboard')
    }
  }, [user, userProfile, authLoading, router])

  const handleTaskComplete = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId])
      toast.success('Task completed!')
    }
  }

  const allTasksCompleted = completedTasks.length === activationTasks.length

  const handleClaimReward = async () => {
    if (!allTasksCompleted || !userProfile) return
    
    setClaiming(true)
    try {
      // Create activation ticket
      await createTicket(
        userProfile.uid,
        userProfile.fullName || userProfile.displayName,
        userProfile.phone || '',
        userProfile.address || '',
        'activation'
      )

      // Update user activation status
      await updateUserProfile({
        activationCompleted: true,
        completedTasks: (userProfile.completedTasks || 0) + activationTasks.length,
      })

      await refreshUserProfile()
      
      toast.success('Congratulations! You earned 1 lottery ticket!')
      router.push('/dashboard')
    } catch {
      toast.error('Failed to claim reward')
    } finally {
      setClaiming(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden islamic-pattern">
      <ThreeBackgroundSimple />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 card-glow">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/50 mb-4"
            >
              <Image
                src="https://i.imgur.com/VZmr8Dr.jpeg"
                alt="BitDeen Logo"
                fill
                className="object-cover"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-gold-gradient">Account Activation</h1>
            <p className="text-muted-foreground text-center mt-2 text-sm">
              Complete all tasks below to activate your account and earn your first lottery ticket!
            </p>
          </div>

          {/* Reward Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <Gift className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Activation Reward</p>
                <div className="flex items-center gap-2 text-primary">
                  <Ticket className="w-4 h-4" />
                  <span className="font-bold">1 Lottery Ticket</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-primary">
                {completedTasks.length} / {activationTasks.length}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedTasks.length / activationTasks.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              />
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3 mb-6">
            {activationTasks.map((task, index) => (
              <ActivationTaskCard
                key={task.id}
                platform={task.platform}
                title={task.title}
                link={task.link}
                isCompleted={completedTasks.includes(task.id)}
                onComplete={() => handleTaskComplete(task.id)}
                index={index}
              />
            ))}
          </div>

          {/* Claim Button */}
          {allTasksCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                onClick={handleClaimReward}
                disabled={claiming}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 rounded-xl"
              >
                {claiming ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Claim Your Reward
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <div className="text-center p-4 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground">
                Complete all tasks to claim your reward
              </p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-3 h-3 rounded-full bg-primary/50" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-muted" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
