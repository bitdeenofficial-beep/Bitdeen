'use client'

import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  index?: number
  variant?: 'default' | 'primary' | 'success' | 'warning'
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  index = 0,
  variant = 'default',
}: StatCardProps) {
  const variants = {
    default: 'from-card to-card border-border/50',
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    success: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    warning: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
  }

  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${variants[variant]} border p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconVariants[variant]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent" />
    </motion.div>
  )
}

interface ProgressStatCardProps {
  title: string
  current: number
  total: number
  icon: LucideIcon
  reward?: string
  index?: number
}

export function ProgressStatCard({
  title,
  current,
  total,
  icon: Icon,
  reward,
  index = 0,
}: ProgressStatCardProps) {
  const progress = Math.min((current / total) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">
            {current} <span className="text-muted-foreground text-lg">/ {total}</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
        />
      </div>

      {reward && (
        <p className="mt-3 text-xs text-muted-foreground">
          Reward: <span className="text-primary font-medium">{reward}</span>
        </p>
      )}
    </motion.div>
  )
}
