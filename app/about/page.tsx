'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Info,
  Target,
  Shield,
  Users,
  Heart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'All lottery draws are conducted publicly with live streaming. Every ticket and winner is verifiable.',
    },
    {
      icon: Heart,
      title: 'Fairness',
      description: 'Our system ensures equal opportunity for all participants. Every ticket has the same chance of winning.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We are building a global community of task completers and lottery enthusiasts.',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Combining social media engagement with lottery rewards in a unique and exciting way.',
    },
  ]

  const features = [
    'Free to join and participate',
    'No purchase necessary to win',
    'Multiple ways to earn tickets',
    'Live lottery draws',
    'Instant ticket generation',
    'Secure and fair system',
    'Global participation',
    '24/7 customer support',
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
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-primary/50">
                <Image
                  src="https://i.imgur.com/VZmr8Dr.jpeg"
                  alt="BitDeen Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              About <span className="text-gold-gradient">BitDeen</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A revolutionary task-based lottery system that rewards your engagement with real prizes.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <Card className="bg-card/80 backdrop-blur-xl border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  BitDeen was created with a simple mission: to reward people for their time and engagement. 
                  We believe everyone deserves a chance to win, and we have built a platform that makes it 
                  possible through simple, everyday tasks. Our task-based lottery system is designed to be 
                  fair, transparent, and accessible to everyone around the world.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-card/50 border-border/50 h-full hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What We Offer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">What We Offer</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Join?</h2>
            <p className="text-muted-foreground mb-6">
              Start earning lottery tickets today and get your chance to win amazing prizes!
            </p>
            <Link href="/login">
              <Button size="lg" className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
