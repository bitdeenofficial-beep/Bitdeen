'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Card, CardContent } from '@/components/ui/card'
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Ticket,
  Users,
  Calendar,
  ListTodo,
  Target,
  Shield,
} from 'lucide-react'

export default function RulesPage() {
  const generalRules = [
    'Users must be 18 years or older to participate',
    'One account per person - multiple accounts are prohibited',
    'All information provided must be accurate and truthful',
    'Users must complete profile setup including valid contact information',
    'Tickets are non-transferable and cannot be sold or exchanged',
  ]

  const earningRules = [
    {
      icon: CheckCircle2,
      title: 'Account Activation',
      description: 'Complete all 5 activation tasks (YouTube, Facebook, Telegram, Twitter, Instagram) to earn 1 ticket',
    },
    {
      icon: Calendar,
      title: 'Daily Check-in',
      description: 'Check in once per day to earn 1 ticket. Check-in resets at midnight UTC.',
    },
    {
      icon: Users,
      title: 'Referral Program',
      description: 'Earn 10 tickets for each friend who signs up using your referral code and completes activation.',
    },
    {
      icon: ListTodo,
      title: 'Task Completion',
      description: 'Complete social media tasks posted by admin. Ticket rewards vary per task.',
    },
    {
      icon: Target,
      title: 'Mission Milestones',
      description: 'Complete 10 tasks = 1 ticket, 100 tasks = 10 tickets, 1000 tasks = 100 tickets.',
    },
  ]

  const drawRules = [
    'Lottery draws are conducted at scheduled times announced in advance',
    'All active tickets are eligible for the draw',
    'Winners are selected randomly using a fair randomization system',
    'Draws are broadcast live on YouTube and Facebook for transparency',
    'Winners will be announced during the live draw and on the Winners page',
    'Winners will be contacted via their registered email and phone number',
    'Prizes must be claimed within 30 days of the draw announcement',
    'BitDeen reserves the right to verify winner eligibility before prize distribution',
  ]

  const prohibitedActions = [
    'Creating multiple accounts',
    'Using bots or automated systems to complete tasks',
    'Providing false information',
    'Attempting to manipulate the system',
    'Sharing account credentials',
    'Engaging in fraudulent referral activities',
  ]

  return (
    <div className="min-h-screen islamic-pattern">
      <ThreeBackgroundSimple />
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Rules & <span className="text-gold-gradient">Guidelines</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Please read and understand our rules before participating
            </p>
          </motion.div>

          {/* General Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">General Rules</h2>
                </div>
                <ul className="space-y-3">
                  {generalRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Earning Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">How to Earn Tickets</h2>
                </div>
                <div className="space-y-4">
                  {earningRules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <rule.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{rule.title}</h3>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Draw Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Lottery Draw Rules</h2>
                </div>
                <ul className="space-y-3">
                  {drawRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prohibited Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <h2 className="text-xl font-bold">Prohibited Actions</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  The following actions will result in account suspension or permanent ban:
                </p>
                <ul className="space-y-3">
                  {prohibitedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>
              By using BitDeen, you agree to abide by these rules. BitDeen reserves the right 
              to modify these rules at any time. Users will be notified of any significant changes.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
