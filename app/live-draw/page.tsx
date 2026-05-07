'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getDrawSettings } from '@/lib/ticket-service'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Countdown } from '@/components/countdown'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Play,
  Youtube,
  Facebook,
  Calendar,
  Trophy,
  Gift,
  Loader2,
  ExternalLink,
} from 'lucide-react'

export default function LiveDrawPage() {
  const [drawSettings, setDrawSettings] = useState<{
    nextDrawDate: Date
    prizeImage: string
    prizeDescription: string
    livestreamUrl: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getDrawSettings()
        setDrawSettings(data)
      } catch (error) {
        console.error('Error fetching draw settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const isLive = drawSettings?.nextDrawDate && new Date() >= drawSettings.nextDrawDate

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
              <Play className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Live <span className="text-gold-gradient">Draw</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Watch the lottery draw live and see the winners announced!
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Live Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                {isLive ? (
                  <Card className="bg-red-500/10 border-red-500/30">
                    <CardContent className="p-6 flex items-center justify-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xl font-bold text-red-500">LIVE NOW</span>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-card/80 backdrop-blur-xl border-border/50">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <p className="text-sm text-muted-foreground mb-2">Next Draw In</p>
                      </div>
                      {drawSettings?.nextDrawDate && (
                        <Countdown targetDate={drawSettings.nextDrawDate} />
                      )}
                      <p className="text-center text-sm text-muted-foreground mt-6">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {drawSettings?.nextDrawDate?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>

              {/* Live Stream Embed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {drawSettings?.livestreamUrl ? (
                      <iframe
                        src={drawSettings.livestreamUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <Play className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">Live stream will appear here</p>
                        <p className="text-sm text-muted-foreground/60 mt-2">
                          The stream will start shortly before the scheduled draw time
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Watch Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              >
                <a
                  href="https://youtube.com/@bitdeen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="bg-red-500/10 border-red-500/30 hover:bg-red-500/20 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <Youtube className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Watch on YouTube</p>
                        <p className="text-sm text-muted-foreground">Live stream available</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </a>

                <a
                  href="https://facebook.com/bitdeen"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                        <Facebook className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Watch on Facebook</p>
                        <p className="text-sm text-muted-foreground">Live stream available</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </a>
              </motion.div>

              {/* Prize Info */}
              {drawSettings?.prizeDescription && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-8"
                >
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Gift className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Prize Pool</p>
                          <p className="text-xl font-bold text-primary">{drawSettings.prizeDescription}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <p className="text-muted-foreground mb-4">
                  {"Don't have tickets yet? Start earning now!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                      Get Free Tickets
                    </Button>
                  </Link>
                  <Link href="/winners">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/30 hover:bg-primary/10">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Past Winners
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
