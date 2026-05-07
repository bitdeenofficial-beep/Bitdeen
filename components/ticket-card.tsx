'use client'

import { motion } from 'framer-motion'
import { Ticket as TicketIcon, Calendar, User, Phone, MapPin, Sparkles } from 'lucide-react'
import type { Ticket } from '@/lib/ticket-service'

interface TicketCardProps {
  ticket: Ticket
  index?: number
}

export function TicketCard({ ticket, index = 0 }: TicketCardProps) {
  const sourceColors = {
    activation: 'from-emerald-500/20 to-emerald-500/5',
    referral: 'from-blue-500/20 to-blue-500/5',
    daily: 'from-purple-500/20 to-purple-500/5',
    task: 'from-amber-500/20 to-amber-500/5',
    mission: 'from-rose-500/20 to-rose-500/5',
  }

  const sourceLabels = {
    activation: 'Activation Bonus',
    referral: 'Referral Reward',
    daily: 'Daily Check-in',
    task: 'Task Completion',
    mission: 'Mission Reward',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group"
    >
      <div className="ticket-card rounded-2xl p-6 hover:border-primary/40 transition-all duration-300">
        {/* Ticket Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <TicketIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Lottery Ticket</p>
              <p className="text-lg font-bold font-mono text-primary">{ticket.ticketId}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${sourceColors[ticket.source]}`}>
            {sourceLabels[ticket.source]}
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-border/50" />
          </div>
          <div className="relative flex justify-center">
            <Sparkles className="w-4 h-4 text-primary bg-card px-1" />
          </div>
        </div>

        {/* Ticket Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{ticket.userName}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{ticket.phone || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Address:</span>
            <span className="font-medium truncate">{ticket.address || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">
              {ticket.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            ticket.status === 'active' 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : ticket.status === 'winner'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              ticket.status === 'active' 
                ? 'bg-emerald-400' 
                : ticket.status === 'winner'
                ? 'bg-primary'
                : 'bg-muted-foreground'
            }`} />
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
      </div>
    </motion.div>
  )
}

export function TicketCardMini({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <TicketIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-mono font-bold text-sm text-primary">{ticket.ticketId}</p>
          <p className="text-xs text-muted-foreground">
            {ticket.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full ${
        ticket.status === 'active' ? 'bg-emerald-400' : 'bg-muted-foreground'
      }`} />
    </div>
  )
}
