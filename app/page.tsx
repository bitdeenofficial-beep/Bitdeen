'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getWinners, getAnnouncements, getDrawSettings, type Winner, type Announcement } from '@/lib/ticket-service'
import { Navbar } from '@/components/navbar'
import { ThreeBackground } from '@/components/three-background'
import { Countdown } from '@/components/countdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Ticket,
  Gift,
  Users,
  Shield,
  Trophy,
  Star,
  ChevronRight,
  Play,
  ArrowRight,
  Sparkles,
  Calendar,
  ListTodo,
  Target,
} from 'lucide-react'

export default function HomePage() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [drawSettings, setDrawSettings] = useState<{
    nextDrawDate: Date
    prizeImage: string
    prizeDescription: string
    livestreamUrl: string
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [winnersData, announcementsData, drawData] = await Promise.all([
          getWinners(3),
          getAnnouncements(),
          getDrawSettings(),
        ])
        setWinners(winnersData)
        setAnnouncements(announcementsData)
        setDrawSettings(drawData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const features = [
    {
      icon: ListTodo,
      title: 'Complete Tasks',
      description: 'Follow social channels, watch videos, and complete simple tasks',
    },
    {
      icon: Ticket,
      title: 'Earn Tickets',
      description: 'Get lottery tickets for every task you complete',
    },
    {
      icon: Gift,
      title: 'Win Prizes',
      description: 'Amazing prizes in every lottery draw',
    },
    {
      icon: Users,
      title: 'Refer Friends',
      description: 'Earn 10 tickets for every friend you invite',
    },
  ]

  const howItWorks = [
    { step: 1, title: 'Sign Up', description: 'Create your free account with Google' },
    { step: 2, title: 'Complete Tasks', description: 'Follow channels and complete activities' },
    { step: 3, title: 'Earn Tickets', description: 'Get lottery tickets as rewards' },
    { step: 4, title: 'Win Prizes', description: 'Wait for the draw and win big!' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Tickets Issued' },
    { value: '100+', label: 'Winners' },
    { value: '$50K+', label: 'Prizes Given' },
  ]

  return (
    <div className="min-h-screen islamic-pattern">
      <ThreeBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="relative w-24 h-24 mx-auto lg:mx-0 rounded-full overflow-hidden border-4 border-primary/50 mb-6"
              >
                <Image
                  src="https://i.imgur.com/VZmr8Dr.jpeg"
                  alt="BitDeen Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to{' '}
                <span className="text-gold-gradient">BitDeen</span>
              </h1>
              <p className="text-xl text-muted-foreground mt-6 max-w-xl mx-auto lg:mx-0">
                Complete simple tasks, earn lottery tickets, and win amazing prizes. Join thousands of winners today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/rules">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-primary/30 hover:bg-primary/10">
                    <Play className="w-5 h-5 mr-2" />
                    How It Works
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Countdown Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="bg-card/80 backdrop-blur-xl border-border/50 overflow-hidden card-glow">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Next Lottery Draw</p>
                        <p className="font-semibold">Grand Prize</p>
                      </div>
                    </div>
                    <Link href="/live-draw">
                      <Button variant="ghost" size="sm" className="text-primary">
                        Live Draw
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  {drawSettings?.nextDrawDate && (
                    <Countdown targetDate={drawSettings.nextDrawDate} />
                  )}

                  {drawSettings?.prizeDescription && (
                    <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-2">Prize Pool</p>
                      <p className="text-lg font-bold text-primary">{drawSettings.prizeDescription}</p>
                    </div>
                  )}

                  <Link href="/login" className="block mt-6">
                    <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                      Join Now & Get Free Tickets
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcement Banner */}
      {announcements.length > 0 && (
        <section className="py-4 bg-primary/10 border-y border-primary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="shrink-0 px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded">
                NEWS
              </span>
              <div className="flex-1 overflow-hidden">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: '-100%' }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="whitespace-nowrap"
                >
                  {announcements.map((ann, i) => (
                    <span key={ann.id} className="inline-block mr-16">
                      {ann.title}: {ann.content}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Why Choose <span className="text-gold-gradient">BitDeen</span>?
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our task-based lottery system rewards you for simple activities. No purchase necessary!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/50 border-border/50 h-full hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              How It <span className="text-gold-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to start earning lottery tickets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="bg-card/50 border-border/50 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      {winners.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Recent <span className="text-gold-gradient">Winners</span>
                </h2>
                <p className="text-muted-foreground mt-2">
                  Join our growing list of lucky winners!
                </p>
              </div>
              <Link href="/winners">
                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {winners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{winner.userName}</p>
                          <p className="text-sm text-muted-foreground font-mono">{winner.ticketId}</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50">
                        <p className="text-xs text-muted-foreground mb-1">Prize Won</p>
                        <p className="font-bold text-primary">{winner.prize}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 overflow-hidden">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Win?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join BitDeen today and start earning lottery tickets. Your winning journey begins here!
                </p>
                <Link href="/login">
                  <Button size="lg" className="h-14 px-10 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Earning Tickets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
                  <Image
                    src="https://i.imgur.com/VZmr8Dr.jpeg"
                    alt="BitDeen Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-gold-gradient">BitDeen</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                Premium task-based lottery system. Complete tasks, earn tickets, and win amazing prizes.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Contact: <a href="mailto:bitdeenofficial@gmail.com" className="text-primary hover:underline">bitdeenofficial@gmail.com</a>
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary">About Us</Link>
                <Link href="/rules" className="block text-sm text-muted-foreground hover:text-primary">Rules</Link>
                <Link href="/faq" className="block text-sm text-muted-foreground hover:text-primary">FAQ</Link>
                <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary">Contact</Link>
              </div>
            </div>

            {/* More Links */}
            <div>
              <h4 className="font-semibold mb-4">More</h4>
              <div className="space-y-2">
                <Link href="/winners" className="block text-sm text-muted-foreground hover:text-primary">Winners</Link>
                <Link href="/live-draw" className="block text-sm text-muted-foreground hover:text-primary">Live Draw</Link>
                <Link href="/login" className="block text-sm text-muted-foreground hover:text-primary">Login</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BitDeen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
