'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Phone,
  Mail,
  Send,
  MessageCircle,
  Facebook,
  Youtube,
  Instagram,
  Loader2,
} from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'bitdeenofficial@gmail.com',
      link: 'mailto:bitdeenofficial@gmail.com',
    },
    {
      icon: Send,
      title: 'Telegram',
      value: '@bitdeen',
      link: 'https://t.me/bitdeen',
    },
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/bitdeen' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@bitdeen' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/bitdeen' },
    { icon: Send, label: 'Telegram', href: 'https://t.me/bitdeen' },
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
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Contact <span className="text-gold-gradient">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions? We are here to help!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card/80 backdrop-blur-xl border-border/50">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        required
                        className="bg-muted/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="bg-muted/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What is this about?"
                        required
                        className="bg-muted/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your message..."
                        required
                        rows={5}
                        className="bg-muted/50 border-border/50 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Contact Methods */}
              {contactMethods.map((method, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-xl border-border/50">
                  <CardContent className="p-6">
                    <a
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{method.title}</p>
                        <p className="font-semibold text-primary">{method.value}</p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              ))}

              {/* Social Links */}
              <Card className="bg-card/80 backdrop-blur-xl border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Follow Us</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-colors"
                      >
                        <social.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Link */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Have Common Questions?</h3>
                      <p className="text-sm text-muted-foreground">
                        Check our{' '}
                        <a href="/faq" className="text-primary hover:underline">
                          FAQ page
                        </a>{' '}
                        for quick answers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
