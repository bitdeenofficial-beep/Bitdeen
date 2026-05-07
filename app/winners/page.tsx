'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getWinners, type Winner } from '@/lib/ticket-service'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Card, CardContent } from '@/components/ui/card'
import {
  Trophy,
  Medal,
  Award,
  Ticket,
  Calendar,
  User,
  Loader2,
  Crown,
} from 'lucide-react'

export default function PublicWinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const data = await getWinners(100)
        setWinners(data)
      } catch (error) {
        console.error('Error fetching winners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWinners()
  }, [])

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <Trophy className="w-6 h-6 text-primary" />
    }
  }

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30'
      case 2:
        return 'from-gray-400/20 to-gray-400/5 border-gray-400/30'
      case 3:
        return 'from-amber-600/20 to-amber-600/5 border-amber-600/30'
      default:
        return 'from-card to-card border-border/50'
    }
  }

  // Group winners by draw date
  const winnersByDraw = winners.reduce((acc, winner) => {
    const dateKey = winner.drawDate.toLocaleDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(winner)
    return acc
  }, {} as Record<string, Winner[]>)

  return (
    <div className="min-h-screen islamic-pattern">
      <ThreeBackgroundSimple />
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Our <span className="text-gold-gradient">Winners</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Congratulations to all our lucky winners!
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{winners.length}</p>
                <p className="text-sm text-muted-foreground">Total Winners</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
              <CardContent className="p-6 text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-3xl font-bold">{winners.filter(w => w.position === 1).length}</p>
                <p className="text-sm text-muted-foreground">Grand Prizes</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-3xl font-bold">{Object.keys(winnersByDraw).length}</p>
                <p className="text-sm text-muted-foreground">Draws</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Winners List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : winners.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(winnersByDraw).map(([date, drawWinners], groupIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + groupIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Lottery Draw</h2>
                      <p className="text-sm text-muted-foreground">{date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drawWinners
                      .sort((a, b) => a.position - b.position)
                      .map((winner, index) => (
                        <Card
                          key={winner.id}
                          className={`bg-gradient-to-br ${getPositionStyle(winner.position)} border overflow-hidden`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center">
                                  {getPositionIcon(winner.position)}
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Position</p>
                                  <p className="text-xl font-bold">#{winner.position}</p>
                                </div>
                              </div>
                            </div>

                            {winner.prizeImage && (
                              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                <Image
                                  src={winner.prizeImage}
                                  alt={winner.prize}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}

                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{winner.userName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Ticket className="w-4 h-4 text-primary" />
                                <span className="text-sm font-mono">{winner.ticketId}</span>
                              </div>
                              <div className="p-3 rounded-lg bg-background/30">
                                <p className="text-xs text-muted-foreground mb-1">Prize Won</p>
                                <p className="font-semibold text-primary">{winner.prize}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="text-lg font-semibold">No winners yet</h3>
              <p className="text-muted-foreground mt-1">
                Winners will be announced after the first lottery draw
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
