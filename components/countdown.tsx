'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownProps {
  targetDate: Date
  onComplete?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-gradient-to-br from-card to-muted border border-border/50 flex items-center justify-center card-glow">
              <span className="text-2xl sm:text-3xl font-bold text-primary font-mono">
                {unit.value.toString().padStart(2, '0')}
              </span>
            </div>
            {/* Decorative dots */}
            {index < timeUnits.length - 1 && (
              <div className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              </div>
            )}
          </div>
          <span className="mt-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

export function CountdownMini({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        return 'Draw Started!'
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`
      }
      return `${hours}h ${minutes}m`
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 60000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <span className="text-primary font-mono font-bold">{timeLeft}</span>
  )
}
