'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  ExternalLink, 
  Ticket, 
  CheckCircle2, 
  Youtube, 
  Facebook, 
  Instagram, 
  Send,
  Twitter 
} from 'lucide-react'
import type { Task } from '@/lib/ticket-service'

interface TaskCardProps {
  task: Task
  onComplete?: (taskId: string) => void
  isCompleted?: boolean
  index?: number
}

const platformIcons: Record<string, typeof Youtube> = {
  youtube: Youtube,
  facebook: Facebook,
  instagram: Instagram,
  telegram: Send,
  twitter: Twitter,
}

const platformColors: Record<string, string> = {
  youtube: 'from-red-500/20 to-red-500/5 border-red-500/20',
  facebook: 'from-blue-600/20 to-blue-600/5 border-blue-600/20',
  instagram: 'from-pink-500/20 to-pink-500/5 border-pink-500/20',
  telegram: 'from-sky-500/20 to-sky-500/5 border-sky-500/20',
  twitter: 'from-blue-400/20 to-blue-400/5 border-blue-400/20',
  default: 'from-primary/20 to-primary/5 border-primary/20',
}

export function TaskCard({ task, onComplete, isCompleted = false, index = 0 }: TaskCardProps) {
  const [loading, setLoading] = useState(false)
  const Icon = platformIcons[task.platform.toLowerCase()] || ExternalLink
  const colorClass = platformColors[task.platform.toLowerCase()] || platformColors.default

  const handleComplete = async () => {
    if (isCompleted || loading) return
    setLoading(true)
    
    // Open task link
    window.open(task.link, '_blank')
    
    // Simulate verification delay
    setTimeout(() => {
      onComplete?.(task.id)
      setLoading(false)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} border p-5`}
    >
      <div className="flex items-start gap-4">
        {/* Platform Icon */}
        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-base">{task.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            </div>
            
            {/* Reward Badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              <Ticket className="w-3 h-3" />
              +{task.reward}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 flex items-center gap-3">
            {isCompleted ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Completed
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleComplete}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">...</span>
                    Verifying
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Complete Task
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task Image */}
      {task.imageUrl && (
        <div className="mt-4 relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={task.imageUrl}
            alt={task.title}
            fill
            className="object-cover"
          />
        </div>
      )}
    </motion.div>
  )
}

interface ActivationTaskCardProps {
  platform: string
  title: string
  link: string
  isCompleted: boolean
  onComplete: () => void
  index?: number
}

export function ActivationTaskCard({
  platform,
  title,
  link,
  isCompleted,
  onComplete,
  index = 0,
}: ActivationTaskCardProps) {
  const [loading, setLoading] = useState(false)
  const Icon = platformIcons[platform.toLowerCase()] || ExternalLink
  const colorClass = platformColors[platform.toLowerCase()] || platformColors.default

  const handleClick = () => {
    if (isCompleted || loading) return
    setLoading(true)
    
    // Open link
    window.open(link, '_blank')
    
    // Verify after delay
    setTimeout(() => {
      onComplete()
      setLoading(false)
    }, 3000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${colorClass} border p-4`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground capitalize">{platform}</p>
        </div>

        {isCompleted ? (
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        ) : (
          <Button
            size="icon"
            onClick={handleClick}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <span className="animate-spin">...</span>
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}
