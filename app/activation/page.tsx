// app/activation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc, runTransaction, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const TASKS = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    link: 'https://youtube.com/@Bitdeenofficial',
    requiredTime: 10,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    link: 'https://facebook.com/bitdeenofficial1',
    requiredTime: 10,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: '💬',
    link: 'https://t.me/bitdeencommunity',
    requiredTime: 10,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    link: 'https://x.com/Bitdeenofficial',
    requiredTime: 10,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    link: 'https://instagram.com/bitdeenofficial',
    requiredTime: 10,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    link: 'https://www.tiktok.com/@bitdeenofficial',
    requiredTime: 10,
  },
];

export default function ActivationPage() {
  const { user, userData, updateUserData } = useAuth();
  const router = useRouter();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  // Load completed tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('activation_tasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever completedTasks changes
  useEffect(() => {
    localStorage.setItem('activation_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const startTimer = (taskId: string, requiredTime: number) => {
    setActiveTimer(taskId);
    let timeLeft = requiredTime;
    
    const interval = setInterval(() => {
      timeLeft--;
      setTimers(prev => ({ ...prev, [taskId]: timeLeft }));
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        setActiveTimer(null);
        setTimers(prev => ({ ...prev, [taskId]: 0 }));
        toast.success(`You can now verify ${taskId}!`);
      }
    }, 1000);
    
    // Store interval ID to clear later
    window._timers = window._timers || {};
    window._timers[taskId] = interval;
  };

  const openLink = (taskId: string, link: string, requiredTime: number) => {
    window.open(link, '_blank');
    startTimer(taskId, requiredTime);
  };

  const verifyTask = (taskId: string) => {
    if (timers[taskId] !== 0 && timers[taskId] !== undefined) {
      toast.error(`Please wait ${timers[taskId]} more seconds`);
      return;
    }
    
    if (!completedTasks.includes(taskId)) {
      const newCompleted = [...completedTasks, taskId];
      setCompletedTasks(newCompleted);
      toast.success(`${taskId} completed!`);
    } else {
      toast.error('Task already completed');
    }
  };

  const generateTicketId = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const counterRef = doc(db, 'system', 'ticketCount');
    
    const newNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      const currentCount = counterDoc.exists() ? counterDoc.data().count : 0;
      const newCount = currentCount + 1;
      transaction.set(counterRef, { count: newCount });
      return newCount;
    });
    
    return `BT-${year}-${newNumber.toString().padStart(6, '0')}`;
  };

  const claimReward = async () => {
    if (completedTasks.length !== TASKS.length) {
      toast.error(`Complete all ${TASKS.length} tasks first!`);
      return;
    }

    if (!user || !userData) {
      toast.error('Please login first');
      return;
    }

    if (userData.activationCompleted) {
      toast.error('You already claimed your reward!');
      router.push('/dashboard');
      return;
    }

    setIsClaiming(true);
    
    try {
      // Generate ticket ID
      const ticketId = await generateTicketId();
      
      // Create ticket document
      const ticketRef = doc(db, 'tickets', ticketId);
      await setDoc(ticketRef, {
        ticketId: ticketId,
        userId: user.uid,
        userName: userData.displayName || userData.fullName,
        phone: userData.phone || '',
        address: userData.address || '',
        source: 'activation',
        status: 'active',
        createdAt: new Date(),
      });
      
      // Update user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        activationCompleted: true,
        totalTickets: (userData.totalTickets || 0) + 1,
        completedTasks: TASKS.map(t => t.id),
      });
      
      // Update local user data
      await updateUserData({
        activationCompleted: true,
        totalTickets: (userData.totalTickets || 0) + 1,
      });
      
      // Clear localStorage
      localStorage.removeItem('activation_tasks');
      
      toast.success(`Congratulations! Ticket ${ticketId} created!`);
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Claim error:', error);
      toast.error(error.message || 'Failed to claim reward');
    } finally {
      setIsClaiming(false);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (window._timers) {
        Object.values(window._timers).forEach(clearInterval);
      }
    };
  }, []);

  const allCompleted = completedTasks.length === TASKS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 to-dark-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Complete Tasks to Activate
          </h1>
          <p className="text-gray-400 mt-2">
            Complete all tasks to get your first lottery ticket
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="bg-primary/20 px-4 py-2 rounded-full">
              Completed: {completedTasks.length}/{TASKS.length}
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TASKS.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            const timeLeft = timers[task.id];
            const isTimerActive = activeTimer === task.id;
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-6 ${
                  isCompleted ? 'border-primary/50 bg-primary/10' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">{task.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
                  
                  {!isCompleted ? (
                    <>
                      {!isTimerActive && timeLeft !== 0 ? (
                        <button
                          onClick={() => openLink(task.id, task.link, task.requiredTime)}
                          className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded-lg transition"
                        >
                          Open {task.name}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          {isTimerActive && timeLeft > 0 && (
                            <div className="text-yellow-400">
                              Wait {timeLeft}s...
                            </div>
                          )}
                          <button
                            onClick={() => verifyTask(task.id)}
                            disabled={timeLeft !== 0 && timeLeft !== undefined}
                            className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary py-2 rounded-lg transition disabled:opacity-50"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-green-500">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Claim Button */}
        <div className="mt-8 text-center">
          <button
            onClick={claimReward}
            disabled={!allCompleted || isClaiming}
            className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
              allCompleted && !isClaiming
                ? 'bg-gradient-to-r from-primary to-secondary hover:scale-105 animate-glow'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            {isClaiming ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Claiming...
              </span>
            ) : (
              '🎟️ Claim Your Reward Ticket'
            )}
          </button>
          
          {allCompleted && !userData?.activationCompleted && (
            <p className="text-green-400 mt-2 text-sm">
              You will receive 1 lottery ticket!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Add type declaration for window
declare global {
  interface Window {
    _timers: Record<string, NodeJS.Timeout>;
  }
}
