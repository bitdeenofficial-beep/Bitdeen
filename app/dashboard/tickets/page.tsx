'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { getUserTickets, type Ticket } from '@/lib/ticket-service'
import { TicketCard, TicketCardMini } from '@/components/ticket-card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  LayoutGrid,
  List,
  Loader2,
} from 'lucide-react'

export default function TicketsPage() {
  const { userProfile } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSource, setFilterSource] = useState<string>('all')

  useEffect(() => {
    const fetchTickets = async () => {
      if (!userProfile?.uid) return

      try {
        const userTickets = await getUserTickets(userProfile.uid)
        setTickets(userTickets)
      } catch (error) {
        console.error('Error fetching tickets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [userProfile?.uid])

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterSource === 'all' || ticket.source === filterSource
    return matchesSearch && matchesFilter
  })

  const ticketStats = {
    total: tickets.length,
    active: tickets.filter((t) => t.status === 'active').length,
    winner: tickets.filter((t) => t.status === 'winner').length,
  }

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <TicketIcon className="w-8 h-8 text-primary" />
            My Tickets
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your lottery tickets
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-3xl sm:text-4xl font-bold text-primary">{ticketStats.total}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Tickets</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-3xl sm:text-4xl font-bold text-emerald-400">{ticketStats.active}</p>
          <p className="text-sm text-muted-foreground mt-1">Active</p>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-3xl sm:text-4xl font-bold text-amber-400">{ticketStats.winner}</p>
          <p className="text-sm text-muted-foreground mt-1">Winners</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ticket ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[160px] bg-card border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="activation">Activation</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="daily">Daily Check-in</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="mission">Mission</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-lg border border-border/50 overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary' : ''}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-primary' : ''}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tickets Display */}
      {filteredTickets.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTickets.map((ticket, index) => (
              <TicketCard key={ticket.id} ticket={ticket} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <TicketCardMini key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <TicketIcon className="w-10 h-10 text-primary/50" />
          </div>
          <h3 className="text-lg font-semibold">No tickets found</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            {searchQuery || filterSource !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Complete tasks, check in daily, or invite friends to earn tickets!'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
