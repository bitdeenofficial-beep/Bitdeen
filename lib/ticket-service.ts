import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

export interface Ticket {
  id: string
  ticketId: string
  userId: string
  userName: string
  phone: string
  address: string
  createdAt: Date
  source: 'activation' | 'referral' | 'daily' | 'task' | 'mission'
  status: 'active' | 'winner' | 'expired'
}

export interface Task {
  id: string
  title: string
  description: string
  platform: string
  link: string
  reward: number
  imageUrl?: string
  isActive: boolean
  createdAt: Date
}

export interface Winner {
  id: string
  userId: string
  userName: string
  ticketId: string
  prize: string
  prizeImage?: string
  drawDate: Date
  position: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
}

// Generate ticket ID
export const generateTicketId = async (): Promise<string> => {
  const year = new Date().getFullYear()
  const ticketsRef = collection(db, 'tickets')
  const countDoc = await getDoc(doc(db, 'system', 'ticketCount'))
  
  let nextNumber = 1
  if (countDoc.exists()) {
    nextNumber = (countDoc.data().count || 0) + 1
  }
  
  // Update count
  await updateDoc(doc(db, 'system', 'ticketCount'), {
    count: increment(1)
  }).catch(async () => {
    // If document doesn't exist, create it
    const { setDoc } = await import('firebase/firestore')
    await setDoc(doc(db, 'system', 'ticketCount'), { count: 1 })
  })
  
  return `BT-${year}-${nextNumber.toString().padStart(6, '0')}`
}

// Create ticket
export const createTicket = async (
  userId: string,
  userName: string,
  phone: string,
  address: string,
  source: Ticket['source']
): Promise<Ticket> => {
  const ticketId = await generateTicketId()
  
  const ticketData = {
    ticketId,
    userId,
    userName,
    phone,
    address,
    source,
    status: 'active' as const,
    createdAt: serverTimestamp(),
  }
  
  const docRef = await addDoc(collection(db, 'tickets'), ticketData)
  
  // Update user's total tickets
  await updateDoc(doc(db, 'users', userId), {
    totalTickets: increment(1)
  })
  
  return {
    id: docRef.id,
    ...ticketData,
    createdAt: new Date(),
  }
}

// Create multiple tickets
export const createMultipleTickets = async (
  userId: string,
  userName: string,
  phone: string,
  address: string,
  source: Ticket['source'],
  count: number
): Promise<Ticket[]> => {
  const tickets: Ticket[] = []
  
  for (let i = 0; i < count; i++) {
    const ticket = await createTicket(userId, userName, phone, address, source)
    tickets.push(ticket)
  }
  
  return tickets
}

// Get user tickets
export const getUserTickets = async (userId: string): Promise<Ticket[]> => {
  const ticketsRef = collection(db, 'tickets')
  const q = query(
    ticketsRef, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Ticket[]
}

// Get active tasks
export const getActiveTasks = async (): Promise<Task[]> => {
  const tasksRef = collection(db, 'tasks')
  const q = query(
    tasksRef,
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Task[]
}

// Get announcements
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const announcementsRef = collection(db, 'announcements')
  const q = query(
    announcementsRef,
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(10)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Announcement[]
}

// Get winners
export const getWinners = async (limitCount = 50): Promise<Winner[]> => {
  const winnersRef = collection(db, 'winners')
  const q = query(
    winnersRef,
    orderBy('drawDate', 'desc'),
    limit(limitCount)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    drawDate: doc.data().drawDate?.toDate() || new Date(),
  })) as Winner[]
}

// Check and perform daily check-in
export const performDailyCheckIn = async (
  userId: string,
  userName: string,
  phone: string,
  address: string
): Promise<{ success: boolean; ticket?: Ticket; message: string }> => {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) {
    return { success: false, message: 'User not found' }
  }
  
  const userData = userDoc.data()
  const lastCheckIn = userData.lastCheckIn?.toDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (lastCheckIn) {
    const lastCheckInDate = new Date(lastCheckIn)
    lastCheckInDate.setHours(0, 0, 0, 0)
    
    if (lastCheckInDate.getTime() === today.getTime()) {
      return { success: false, message: 'Already checked in today' }
    }
  }
  
  // Perform check-in
  await updateDoc(userRef, {
    lastCheckIn: serverTimestamp(),
    dailyCheckIns: increment(1)
  })
  
  // Create ticket
  const ticket = await createTicket(userId, userName, phone, address, 'daily')
  
  return { success: true, ticket, message: 'Check-in successful! You earned 1 ticket.' }
}

// Process referral
export const processReferral = async (
  referredUserId: string,
  referrerCode: string,
  referredUserName: string,
  phone: string,
  address: string
): Promise<{ success: boolean; message: string }> => {
  // Find referrer by code
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('referralCode', '==', referrerCode))
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return { success: false, message: 'Invalid referral code' }
  }
  
  const referrerDoc = snapshot.docs[0]
  const referrerId = referrerDoc.id
  const referrerData = referrerDoc.data()
  
  // Check if user hasn't already been referred
  const referredUserDoc = await getDoc(doc(db, 'users', referredUserId))
  if (referredUserDoc.exists() && referredUserDoc.data().referredBy) {
    return { success: false, message: 'User already has a referrer' }
  }
  
  // Update referred user
  await updateDoc(doc(db, 'users', referredUserId), {
    referredBy: referrerId
  })
  
  // Create 10 tickets for referrer
  await createMultipleTickets(
    referrerId,
    referrerData.fullName || referrerData.displayName,
    referrerData.phone || '',
    referrerData.address || '',
    'referral',
    10
  )
  
  return { success: true, message: 'Referral processed! Referrer earned 10 tickets.' }
}

// Get draw settings
export const getDrawSettings = async () => {
  const settingsDoc = await getDoc(doc(db, 'system', 'drawSettings'))
  if (settingsDoc.exists()) {
    const data = settingsDoc.data()
    return {
      nextDrawDate: data.nextDrawDate?.toDate() || new Date(),
      prizeImage: data.prizeImage || '',
      prizeDescription: data.prizeDescription || '',
      livestreamUrl: data.livestreamUrl || '',
    }
  }
  return {
    nextDrawDate: new Date(),
    prizeImage: '',
    prizeDescription: '',
    livestreamUrl: '',
  }
}

// Get user stats
export const getUserStats = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId))
  if (!userDoc.exists()) return null
  
  const userData = userDoc.data()
  
  // Get referral count
  const usersRef = collection(db, 'users')
  const referralQuery = query(usersRef, where('referredBy', '==', userId))
  const referralSnapshot = await getDocs(referralQuery)
  
  return {
    totalTickets: userData.totalTickets || 0,
    referralCount: referralSnapshot.size,
    completedTasks: userData.completedTasks || 0,
    dailyCheckIns: userData.dailyCheckIns || 0,
    lastCheckIn: userData.lastCheckIn?.toDate(),
  }
}
