'use client'

import { useState } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Ticket,
  Calendar,
  Edit2,
  Save,
  X,
  Loader2,
} from 'lucide-react'

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Bangladesh', 'Egypt', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Jordan', 'Kuwait', 'Lebanon', 'Libya',
  'Malaysia', 'Morocco', 'Nigeria', 'Oman', 'Pakistan', 'Palestine',
  'Qatar', 'Saudi Arabia', 'Somalia', 'Sudan', 'Syria', 'Tunisia',
  'Turkey', 'UAE', 'United Kingdom', 'United States', 'Yemen', 'Other'
]

export default function ProfilePage() {
  const { userProfile, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    country: userProfile?.country || '',
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateUserProfile(formData)
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: userProfile?.fullName || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || '',
      country: userProfile?.country || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/50 mb-4">
                  <Image
                    src={userProfile?.photoURL || 'https://i.imgur.com/VZmr8Dr.jpeg'}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{userProfile?.fullName || userProfile?.displayName}</h2>
                <p className="text-sm text-muted-foreground">{userProfile?.email}</p>

                <div className="w-full mt-6 pt-6 border-t border-border/50 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Tickets</span>
                    <span className="font-bold text-primary flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      {userProfile?.totalTickets || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tasks Completed</span>
                    <span className="font-medium">{userProfile?.completedTasks || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Check-ins</span>
                    <span className="font-medium">{userProfile?.dailyCheckIns || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {userProfile?.createdAt
                        ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="w-full mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Referral Code</p>
                  <p className="text-lg font-bold font-mono text-primary">{userProfile?.referralCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Account Information</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="border-border/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-primary text-primary-foreground"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  value={userProfile?.email || ''}
                  disabled
                  className="bg-muted/50 border-border/50"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'bg-muted/50 border-border/50 focus:border-primary' : 'bg-muted/30'}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'bg-muted/50 border-border/50 focus:border-primary' : 'bg-muted/30'}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-primary" />
                  Country
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="bg-muted/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formData.country}
                    disabled
                    className="bg-muted/30"
                  />
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  Address
                </Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? 'bg-muted/50 border-border/50 focus:border-primary' : 'bg-muted/30'}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
