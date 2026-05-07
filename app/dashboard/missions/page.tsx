'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { createMultipleTickets, getUserStats } from '@/lib/ticket-service'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Target,
  Ticket,
  CheckCircle2,
  Loader2,
  Gift,
  Trophy,
  Star,
  Sparkles,
} from 'lucide-react'

interface Mission {
  id: string
  title: string
  description: string
  tasksRequired: number
  ticketReward: number
  icon: typeof Target
  gradient: string
}

const missions: Mission[] = [
  {
    id: 'mission-10',
    title: 'Getting Started',
    description: 'Complete 10 tasks',
    tasksRequired: 10,
    ticketReward: 1,
    icon: Star,
    gradient: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
  },
  {
    id: 'mission-100',
    title: 'Task Master',
    description: 'Complete 100 tasks',
    tasksRequired: 100,
    ticketReward: 10,
    icon: Target,
    gradient: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
  },
  {
    id: 'mission-1000',
    title: 'Legendary',
    description: 'Complete 1000 tasks',
    tasksRequired: 1000,
    ticketReward: 100,
    icon: Trophy,
    gradient: 'from-primary/20 to-primary/5 border-primary/20',
  },
]

export default function MissionsPage() {
  const { userProfile, refreshUserProfile } = useAuth()
  const [completedTasks, setCompletedTasks] = useState(0)
  const [claimedMissions, setClaimedMissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.uid) return

      try {
        const [stats, missionsDoc] = await Promise.all([
          getUserStats(userProfile.uid),
          getDoc(doc(db, 'userMissions', userProfile.uid)),
        ])

        setCompletedTasks(stats?.completedTasks || 0)

        if (missionsDoc.exists()) {
          setClaimedMissions(missionsDoc.data().claimedMissions || [])
        }
      } catch (error) {
        console.error('Error fetching missions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userProfile?.uid])

  const handleClaimMission = async (mission: Mission) => {
    if (!userProfile || claimedMissions.includes(mission.id)) return
    if (completedTasks < mission.tasksRequired) {
      toast.error('Complete more tasks to claim this mission')
      return
    }

    setClaiming(mission.id)
    try {
      // Create tickets
      await createMultipleTickets(
        userProfile.uid,
        userProfile.fullName || userProfile.displayName,
        userProfile.phone || '',
        userProfile.address || '',
        'mission',
        mission.ticketReward
      )

      // Update claimed missions
      const userMissionsRef = doc(db, 'userMissions', userProfile.uid)
      const missionsDoc = await getDoc(userMissionsRef)

      if (missionsDoc.exists()) {
        await updateDoc(userMissionsRef, {
          claimedMissions: [...claimedMissions, mission.id],
        })
      } else {
        await setDoc(userMissionsRef, {
          claimedMissions: [mission.id],
        })
      }

      setClaimedMissions([...claimedMissions, mission.id])
      await refreshUserProfile()

      toast.success(`Mission completed! You earned ${mission.ticketReward} tickets!`)
    } catch (error) {
      console.error('Error claiming mission:', error)
      toast.error('Failed to claim mission')
    } finally {
      setClaiming(null)
    }
  }

  const getMissionStatus = (mission: Mission) => {
    if (claimedMissions.includes(mission.id)) return 'claimed'
    if (completedTasks >= mission.tasksRequired) return 'ready'
    return 'progress'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          Missions
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete milestones to earn bonus lottery tickets
        </p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks Completed</p>
                <p className="text-4xl font-bold text-primary">{completedTasks}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress to next milestone</span>
                <span className="font-medium">
                  {completedTasks < 10
                    ? `${completedTasks}/10`
                    : completedTasks < 100
                    ? `${completedTasks}/100`
                    : completedTasks < 1000
                    ? `${completedTasks}/1000`
                    : 'All milestones reached!'}
                </span>
              </div>
              <Progress
                value={
                  completedTasks < 10
                    ? (completedTasks / 10) * 100
                    : completedTasks < 100
                    ? (completedTasks / 100) * 100
                    : completedTasks < 1000
                    ? (completedTasks / 1000) * 100
                    : 100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missions.map((mission, index) => {
          const status = getMissionStatus(mission)
          const progress = Math.min((completedTasks / mission.tasksRequired) * 100, 100)
          const Icon = mission.icon

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${mission.gradient} border h-full`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    {status === 'claimed' && (
                      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Claimed
                      </div>
                    )}
                    {status === 'ready' && (
                      <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Ready
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3">{mission.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{mission.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {Math.min(completedTasks, mission.tasksRequired)} / {mission.tasksRequired}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Reward */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-background/30">
                    <span className="text-sm text-muted-foreground">Reward</span>
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <Ticket className="w-4 h-4" />
                      {mission.ticketReward} {mission.ticketReward > 1 ? 'Tickets' : 'Ticket'}
                    </div>
                  </div>

                  {/* Action Button */}
                  {status === 'claimed' ? (
                    <Button disabled className="w-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Claimed
                    </Button>
                  ) : status === 'ready' ? (
                    <Button
                      onClick={() => handleClaimMission(mission)}
                      disabled={claiming === mission.id}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 pulse-gold"
                    >
                      {claiming === mission.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Claim Reward
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button disabled className="w-full" variant="outline">
                      {mission.tasksRequired - completedTasks} tasks to go
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-muted/30 border border-border/50"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">How Missions Work</h3>
            <p className="text-sm text-muted-foreground">
              Missions are milestone rewards for completing tasks. Each mission can only be claimed once.
              Complete tasks regularly to unlock bigger rewards and earn more lottery tickets!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
