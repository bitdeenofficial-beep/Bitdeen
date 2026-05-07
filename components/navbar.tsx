'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Menu,
  X,
  Home,
  Ticket,
  ListTodo,
  Gift,
  Users,
  Bell,
  Settings,
  LogOut,
  Trophy,
  Calendar,
  Target,
  MessageCircle,
  Info,
  HelpCircle,
  BookOpen,
  Phone,
} from 'lucide-react'

const publicLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/rules', label: 'Rules', icon: BookOpen },
  { href: '/winners', label: 'Winners', icon: Trophy },
  { href: '/contact', label: 'Contact', icon: Phone },
]

const dashboardLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/dashboard/daily-checkin', label: 'Daily Check-in', icon: Calendar },
  { href: '/dashboard/missions', label: 'Missions', icon: Target },
  { href: '/dashboard/referral', label: 'Referral', icon: Users },
  { href: '/dashboard/announcements', label: 'Announcements', icon: Bell },
  { href: '/dashboard/winners', label: 'Winners', icon: Trophy },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, userProfile, signOut, loading } = useAuth()

  const isDashboard = pathname.startsWith('/dashboard')
  const links = isDashboard ? dashboardLinks : publicLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
              <Image
                src="https://i.imgur.com/VZmr8Dr.jpeg"
                alt="BitDeen Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-gold-gradient">BitDeen</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {links.slice(0, 6).map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu / Login */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user && userProfile ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 h-auto p-1.5">
                        <Avatar className="w-8 h-8 border border-primary/30">
                          <AvatarImage src={userProfile.photoURL} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {userProfile.displayName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-sm font-medium">
                          {userProfile.fullName || userProfile.displayName?.split(' ')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
                      <div className="p-2">
                        <p className="text-sm font-medium">{userProfile.fullName || userProfile.displayName}</p>
                        <p className="text-xs text-muted-foreground">{userProfile.email}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <Ticket className="w-3 h-3 text-primary" />
                          <span className="text-primary font-bold">{userProfile.totalTickets}</span>
                          <span className="text-muted-foreground">tickets</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/profile" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/support" className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Support
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50"
          >
            <div className="px-4 py-3 space-y-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { userProfile } = useAuth()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
            <Image
              src="https://i.imgur.com/VZmr8Dr.jpeg"
              alt="BitDeen Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold text-gold-gradient">BitDeen</span>
        </Link>
      </div>

      {/* User Info */}
      {userProfile && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
            <Avatar className="w-10 h-10 border border-primary/30">
              <AvatarImage src={userProfile.photoURL} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {userProfile.displayName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile.fullName || userProfile.displayName}
              </p>
              <div className="flex items-center gap-1 text-xs text-primary">
                <Ticket className="w-3 h-3" />
                <span className="font-bold">{userProfile.totalTickets}</span>
                <span className="text-muted-foreground">tickets</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {dashboardLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
