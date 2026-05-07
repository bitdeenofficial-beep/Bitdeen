'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  fullName?: string
  phone?: string
  address?: string
  country?: string
  profileCompleted: boolean
  activationCompleted: boolean
  createdAt: Date
  lastLoginAt: Date
  totalTickets: number
  referralCode: string
  referredBy?: string
  completedTasks: number
  dailyCheckIns: number
  lastCheckIn?: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const generateReferralCode = (uid: string) => {
    return `BD${uid.slice(0, 6).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`
  }

  const fetchUserProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile)

        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        })
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          profileCompleted: false,
          activationCompleted: false,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          totalTickets: 0,
          referralCode: generateReferralCode(firebaseUser.uid),
          completedTasks: 0,
          dailyCheckIns: 0,
        }

        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        })

        setUserProfile(newProfile)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        fetchUserProfile(firebaseUser)
      } else {
        setUserProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUserProfile(null)
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, data)

    setUserProfile(prev => (prev ? { ...prev, ...data } : null))
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signOut,
      updateUserProfile,
      refreshUserProfile: async () => {}
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
