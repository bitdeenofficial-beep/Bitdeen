'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { getUserStats, getAnnouncements, getDrawSettings, type Announcement } from '@/lib/ticket-service'
import { StatCard, ProgressStatCard } from '@/components/stat-card'
import { Countdown } from '@/components/countdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Ticket,
  Users,
  ListTodo,
  Calendar,
  Target,
  Bell,
  Trophy,
  ChevronRight,
  Sparkles,
  Gift,
} from 'lucide-react'

interface UserStats {
  totalTickets: number
  referralCount: number
  completedTasks: number
  dailyCheckIns: number
  lastCheckIn?: Date
}

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [drawSettings, setDrawSettings] = useState<{
    nextDrawDate: Date
    prizeImage: string
    prizeDescription: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.uid) return

      try {
        const [userStats, anns, draw] = await Promise.all([
          getUserStats(userProfile.uid),
          getAnnouncements(),
          getDrawSettings(),
        ])

        setStats(userStats)
        setAnnouncements(anns)
        setDrawSettings(draw)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userProfile?.uid])

  const canCheckIn = () => {
    if (!stats?.lastCheckIn) return true
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const lastCheckIn = new Date(stats.lastCheckIn)
    lastCheckIn.setHours(0, 0, 0, 0)
    return today.getTime() > lastCheckIn.getTime()
  }

  const missionProgress = [
    { title: '10 Tasks', current: Math.min(stats?.completedTasks || 0, 10), total: 10, reward: '1 Ticket' },
    { title: '100 Tasks', current: Math.min(stats?.completedTasks || 0, 100), total: 100, reward: '10 Tickets' },
    { title: '1000 Tasks', current: Math.min(stats?.completedTasks || 0, 1000), total: 1000, reward: '100 Tickets' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, <span className="text-gold-gradient">{userProfile?.fullName?.split(' ')[0] || 'User'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's what's happening with your account today."}
          </p>
        </div>
        <Link href="/dashboard/daily-checkin">
          <Button 
            className={`${canCheckIn() ? 'bg-primary hover:bg-primary/90 pulse-gold' : 'bg-muted'} text-primary-foreground`}
            disabled={!canCheckIn()}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {canCheckIn() ? 'Daily Check-in' : 'Checked In Today'}
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={stats?.totalTickets || 0}
          subtitle="Active lottery entries"
          icon={Ticket}
          variant="primary"
          index={0}
        />
        <StatCard
          title="Referrals"
          value={stats?.referralCount || 0}
          subtitle="Friends invited"
          icon={Users}
          variant="success"
          index={1}
        />
        <StatCard
          title="Tasks Completed"
          value={stats?.completedTasks || 0}
          subtitle="Total tasks done"
          icon={ListTodo}
          variant="warning"
          index={2}
        />
        <StatCard
          title="Daily Check-ins"
          value={stats?.dailyCheckIns || 0}
          subtitle="Consecutive days"
          icon={Calendar}
          index={3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Draw Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                  Next Lottery Draw
                </CardTitle>
                <Link href="/dashboard/winners">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View Winners
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-4">
                {drawSettings?.nextDrawDate && (
                  <Countdown targetDate={drawSettings.nextDrawDate} />
                )}
                {drawSettings?.prizeDescription && (
                  <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Gift className="w-5 h-5" />
                      <span className="font-semibold">Grand Prize</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{drawSettings.prizeDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Mission Progress
                </CardTitle>
                <Link href="/dashboard/missions">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="grid gap-4">
                {missionProgress.map((mission, index) => (
                  <ProgressStatCard
                    key={mission.title}
                    title={mission.title}
                    current={mission.current}
                    total={mission.total}
                    reward={mission.reward}
                    icon={Target}
                    index={index}
                  />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/tasks" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 border-border/50 hover:bg-primary/5 hover:border-primary/30">
                    <ListTodo className="w-5 h-5 mr-3 text-primary" />
                    Complete Tasks
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/dashboard/referral" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 border-border/50 hover:bg-primary/5 hover:border-primary/30">
                    <Users className="w-5 h-5 mr-3 text-primary" />
                    Invite Friends
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/dashboard/tickets" className="block">
                  <Button variant="outline" className="w-full justify-start h-12 border-border/50 hover:bg-primary/5 hover:border-primary/30">
                    <Ticket className="w-5 h-5 mr-3 text-primary" />
                    View Tickets
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-primary" />
                  Announcements
                </CardTitle>
                <Link href="/dashboard/announcements">
                  <Button variant="ghost" size="sm" className="text-primary">
                    See All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {announcements.length > 0 ? (
                    <div className="space-y-3">
                      {announcements.slice(0, 5).map((announcement) => (
                        <div
                          key={announcement.id}
                          className="p-3 rounded-lg bg-muted/30 border border-border/30"
                        >
                          <h4 className="font-medium text-sm">{announcement.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {announcement.content}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-2">
                            {announcement.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Bell className="w-10 h-10 text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">No announcements yet</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
