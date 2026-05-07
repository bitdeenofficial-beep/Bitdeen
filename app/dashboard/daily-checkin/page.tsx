'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { performDailyCheckIn, getUserStats } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Calendar,
  Ticket,
  CheckCircle2,
  Sparkles,
  Loader2,
  Gift,
  Flame,
} from 'lucide-react'

export default function DailyCheckInPage() {
  const { userProfile, refreshUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [canCheckIn, setCanCheckIn] = useState(true)
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    streak: 0,
    lastCheckIn: null as Date | null,
  })

  useEffect(() => {
    const fetchStats = async () => {
      if (!userProfile?.uid) return

      try {
        const userStats = await getUserStats(userProfile.uid)
        if (userStats) {
          setStats({
            totalCheckIns: userStats.dailyCheckIns,
            streak: userStats.dailyCheckIns, // Simplified streak
            lastCheckIn: userStats.lastCheckIn || null,
          })

          // Check if already checked in today
          if (userStats.lastCheckIn) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const lastCheckIn = new Date(userStats.lastCheckIn)
            lastCheckIn.setHours(0, 0, 0, 0)
            setCanCheckIn(today.getTime() > lastCheckIn.getTime())
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [userProfile?.uid])

  const handleCheckIn = async () => {
    if (!userProfile || !canCheckIn) return

    setLoading(true)
    try {
      const result = await performDailyCheckIn(
        userProfile.uid,
        userProfile.fullName || userProfile.displayName,
        userProfile.phone || '',
        userProfile.address || ''
      )

      if (result.success) {
        toast.success(result.message)
        setCanCheckIn(false)
        setStats((prev) => ({
          ...prev,
          totalCheckIns: prev.totalCheckIns + 1,
          streak: prev.streak + 1,
          lastCheckIn: new Date(),
        }))
        await refreshUserProfile()
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to check in')
    } finally {
      setLoading(false)
    }
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = now.getDate()

    const days = []

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, status: 'empty' })
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      let status = 'future'
      if (day < today) {
        status = 'past'
      } else if (day === today) {
        status = canCheckIn ? 'today' : 'checked'
      }
      days.push({ day, status })
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          Daily Check-in
        </h1>
        <p className="text-muted-foreground mt-1">
          Check in every day to earn free lottery tickets!
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats.totalCheckIns}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Check-ins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
              <Flame className="w-7 h-7 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-400">{stats.streak}</p>
            <p className="text-sm text-muted-foreground mt-1">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <Ticket className="w-7 h-7 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">{stats.totalCheckIns}</p>
            <p className="text-sm text-muted-foreground mt-1">Tickets Earned</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Check-in Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                {"Today's Check-in"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              {canCheckIn ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center mb-6"
                  >
                    <Ticket className="w-16 h-16 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2">Ready to Check-in!</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Tap the button below to claim your daily lottery ticket
                  </p>
                  <Button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="w-full max-w-xs h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl pulse-gold"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Check In Now
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-2 border-emerald-500/30 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Checked In!</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    {"You've already checked in today. Come back tomorrow!"}
                  </p>
                  <div className="px-6 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-sm text-emerald-400 font-medium">
                      +1 Ticket earned today
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card border-border/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                      item.status === 'empty'
                        ? ''
                        : item.status === 'checked'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                        : item.status === 'today'
                        ? 'bg-primary/20 text-primary font-bold border border-primary/50'
                        : item.status === 'past'
                        ? 'text-muted-foreground/50'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.day}
                    {item.status === 'checked' && (
                      <CheckCircle2 className="w-3 h-3 absolute" />
                    )}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary/20 border border-primary/50" />
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500/20" />
                  <span className="text-muted-foreground">Checked In</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
