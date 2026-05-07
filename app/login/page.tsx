'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Ticket, Shield, Gift, Users } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { user, userProfile, signInWithGoogle, loading } = useAuth()

  useEffect(() => {
    if (user && userProfile) {
      if (!userProfile.profileCompleted) {
        router.push('/complete-profile')
      } else if (!userProfile.activationCompleted) {
        router.push('/activation')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, userProfile, router])

  const features = [
    { icon: Ticket, title: 'Earn Tickets', description: 'Complete tasks to earn lottery tickets' },
    { icon: Gift, title: 'Win Prizes', description: 'Amazing prizes in every draw' },
    { icon: Users, title: 'Refer Friends', description: 'Get 10 tickets per referral' },
    { icon: Shield, title: 'Secure & Fair', description: 'Transparent lottery system' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden islamic-pattern">
      <ThreeBackgroundSimple />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo Card */}
        <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 card-glow">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/50 mb-4"
            >
              <Image
                src="https://i.imgur.com/VZmr8Dr.jpeg"
                alt="BitDeen Logo"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-gold-gradient">BitDeen</h1>
            <p className="text-muted-foreground text-center mt-2">
              Premium Task-Based Lottery System
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="p-3 rounded-xl bg-muted/30 border border-border/30"
              >
                <feature.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Login Button */}
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:bitdeenofficial@gmail.com" className="text-primary hover:underline">
              bitdeenofficial@gmail.com
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
