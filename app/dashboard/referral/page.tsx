'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { getUserStats } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Users,
  Copy,
  Share2,
  Ticket,
  Gift,
  ChevronRight,
  Send,
  Facebook,
  Twitter,
  MessageCircle,
} from 'lucide-react'

export default function ReferralPage() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState({
    referralCount: 0,
    ticketsEarned: 0,
  })
  const [copied, setCopied] = useState(false)

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/login?ref=${userProfile?.referralCode}`
    : ''

  useEffect(() => {
    const fetchStats = async () => {
      if (!userProfile?.uid) return

      try {
        const userStats = await getUserStats(userProfile.uid)
        if (userStats) {
          setStats({
            referralCount: userStats.referralCount,
            ticketsEarned: userStats.referralCount * 10,
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [userProfile?.uid])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success('Referral link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30',
      url: `https://wa.me/?text=Join BitDeen and earn lottery tickets! ${referralLink}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30',
      url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join BitDeen and earn lottery tickets!`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400/20 text-blue-300 hover:bg-blue-400/30',
      url: `https://twitter.com/intent/tweet?text=Join BitDeen and earn lottery tickets!&url=${encodeURIComponent(referralLink)}`,
    },
  ]

  const steps = [
    { step: 1, title: 'Share Your Link', description: 'Send your unique referral link to friends' },
    { step: 2, title: 'Friend Signs Up', description: 'They create an account using your link' },
    { step: 3, title: 'Earn Tickets', description: 'You get 10 lottery tickets instantly!' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          Referral Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Invite friends and earn 10 lottery tickets for each referral!
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-4xl font-bold text-primary mt-1">{stats.referralCount}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Earned</p>
                <p className="text-4xl font-bold text-emerald-400 mt-1">{stats.ticketsEarned}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                <Ticket className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Your Referral Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Referral Code Display */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground mb-1">Your Referral Code</p>
              <p className="text-2xl font-bold font-mono text-primary">{userProfile?.referralCode}</p>
            </div>

            {/* Referral Link Input */}
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-muted/50 border-border/50 font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                className={`shrink-0 ${copied ? 'bg-emerald-500' : 'bg-primary'}`}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  onClick={() => window.open(option.url, '_blank')}
                  className={`h-12 ${option.color} border-none`}
                >
                  <option.icon className="w-5 h-5 mr-2" />
                  {option.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((item, index) => (
                <div
                  key={item.step}
                  className="relative p-6 rounded-xl bg-muted/30 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {index < steps.length - 1 && (
                    <ChevronRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 text-muted-foreground/30 z-10" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reward Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Unlimited Referral Rewards</h3>
            <p className="text-muted-foreground mt-1">
              There is no limit to how many friends you can invite. Each successful referral earns you
              <span className="text-primary font-bold"> 10 lottery tickets</span>!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
