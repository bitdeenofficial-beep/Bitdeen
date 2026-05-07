'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { toast } from 'sonner'
import { User, Phone, MapPin, Globe, ArrowRight, Loader2 } from 'lucide-react'

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Bangladesh', 'Egypt', 'India', 
  'Indonesia', 'Iran', 'Iraq', 'Jordan', 'Kuwait', 'Lebanon', 'Libya',
  'Malaysia', 'Morocco', 'Nigeria', 'Oman', 'Pakistan', 'Palestine',
  'Qatar', 'Saudi Arabia', 'Somalia', 'Sudan', 'Syria', 'Tunisia',
  'Turkey', 'UAE', 'United Kingdom', 'United States', 'Yemen', 'Other'
]

export default function CompleteProfilePage() {
  const router = useRouter()
  const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    country: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
    if (userProfile?.profileCompleted) {
      if (!userProfile.activationCompleted) {
        router.push('/activation')
      } else {
        router.push('/dashboard')
      }
    }
    if (userProfile?.displayName) {
      setFormData(prev => ({ ...prev, fullName: userProfile.displayName }))
    }
  }, [user, userProfile, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.phone || !formData.address || !formData.country) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await updateUserProfile({
        ...formData,
        profileCompleted: true,
      })
      toast.success('Profile completed successfully!')
      router.push('/activation')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden islamic-pattern">
      <ThreeBackgroundSimple />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 card-glow">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/50 mb-4">
              <Image
                src={userProfile?.photoURL || 'https://i.imgur.com/VZmr8Dr.jpeg'}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gold-gradient">Complete Your Profile</h1>
            <p className="text-muted-foreground text-center mt-2 text-sm">
              Please provide your details to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 890"
                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-primary" />
                Country
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger className="h-12 bg-muted/50 border-border/50 focus:border-primary">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter your full address"
                className="h-12 bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl mt-6"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue to Activation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-3 h-3 rounded-full bg-muted" />
            <div className="w-3 h-3 rounded-full bg-muted" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
