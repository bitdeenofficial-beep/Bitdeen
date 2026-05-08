'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
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
    'Users must provide accurate information during registration',
    'One account per user is strictly allowed',
    'Users must complete profile verification before activation',
    'Tickets are non-transferable and system controlled',
    'Any misuse will result in permanent ban',
  ]

  const activationRules = [
    {
      icon: CheckCircle2,
      title: 'Activation System',
      description: 'Users must complete 6 fixed social tasks (Telegram, YouTube, Instagram, Facebook, TikTok, X) to unlock dashboard and earn 1 ticket.',
    },
    {
      icon: Shield,
      title: 'Fixed System',
      description: 'Activation tasks are permanent and cannot be changed or modified for fairness.',
    },
  ]

  const earningRules = [
    {
      icon: ListTodo,
      title: 'Admin Tasks',
      description: 'Earning tasks are provided dynamically by admin through Firebase system.',
    },
    {
      icon: Calendar,
      title: 'Daily Check-in',
      description: 'Users can earn 1 ticket per day by checking in once daily.',
    },
    {
      icon: Users,
      title: 'Referral System',
      description: 'Earn 10 tickets per verified referral after activation.',
    },
    {
      icon: Target,
      title: 'Mission Rewards',
      description: '10 tasks = 1 ticket, 100 tasks = 10 tickets, 1000 tasks = 100 tickets.',
    },
  ]

  const drawRules = [
    'All draws are conducted transparently at scheduled times',
    'Only valid tickets are eligible for lottery draw',
    'Winners are selected using random system',
    'Live draws are streamed on YouTube and Facebook',
    'Winners are announced publicly after draw',
    'Prizes must be claimed within 30 days',
  ]

  const prohibited = [
    'Creating multiple accounts',
    'Using bots or automation',
    'Fake referral activity',
    'System manipulation attempts',
    'Sharing accounts with others',
  ]

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <BookOpen className="mx-auto w-10 h-10 text-yellow-400 mb-3" />
          <h1 className="text-3xl font-bold">
            Rules & Guidelines
          </h1>
          <p className="text-gray-400 mt-2">
            Please read carefully before using the platform
          </p>
        </motion.div>

        {/* GENERAL RULES */}
        <Card className="mb-6 bg-gray-900 border-gray-700">
          <CardContent className="p-5">
            <h2 className="font-bold mb-3">General Rules</h2>
            <ul className="space-y-2 text-gray-300">
              {generalRules.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ACTIVATION RULES */}
        <Card className="mb-6 bg-gray-900 border-gray-700">
          <CardContent className="p-5">
            <h2 className="font-bold mb-3">Activation System</h2>

            {activationRules.map((r, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold text-yellow-400">{r.title}</h3>
                <p className="text-gray-400 text-sm">{r.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* EARNING RULES */}
        <Card className="mb-6 bg-gray-900 border-gray-700">
          <CardContent className="p-5">
            <h2 className="font-bold mb-3">Earning System</h2>

            {earningRules.map((r, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-semibold text-green-400">{r.title}</h3>
                <p className="text-gray-400 text-sm">{r.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* DRAW RULES */}
        <Card className="mb-6 bg-gray-900 border-gray-700">
          <CardContent className="p-5">
            <h2 className="font-bold mb-3">Lottery Rules</h2>
            <ul className="space-y-2 text-gray-300">
              {drawRules.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* PROHIBITED */}
        <Card className="bg-red-950 border-red-700">
          <CardContent className="p-5">
            <h2 className="font-bold mb-3 text-red-400">
              Prohibited Actions
            </h2>
            <ul className="space-y-2 text-gray-300">
              {prohibited.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
