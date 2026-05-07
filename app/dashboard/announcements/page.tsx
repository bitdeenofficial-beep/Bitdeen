'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getAnnouncements, type Announcement } from '@/lib/ticket-service'
import { Card, CardContent } from '@/components/ui/card'
import {
  Bell,
  Calendar,
  Loader2,
  Megaphone,
} from 'lucide-react'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements()
        setAnnouncements(data)
      } catch (error) {
        console.error('Error fetching announcements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          Announcements
        </h1>
        <p className="text-muted-foreground mt-1">
          Stay updated with the latest news and updates
        </p>
      </motion.div>

      {/* Announcements List */}
      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-card border-border/50 overflow-hidden hover:border-primary/30 transition-colors">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {announcement.imageUrl && (
                      <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0">
                        <Image
                          src={announcement.imageUrl}
                          alt={announcement.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Megaphone className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold">{announcement.title}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Calendar className="w-3 h-3" />
                          {announcement.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
            <Bell className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-lg font-semibold">No announcements yet</h3>
          <p className="text-muted-foreground mt-1">
            Check back later for updates and news
          </p>
        </motion.div>
      )}
    </div>
  )
}
