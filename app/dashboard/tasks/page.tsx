'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { getActiveTasks, createTicket, type Task } from '@/lib/ticket-service'
import { doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { TaskCard } from '@/components/task-card'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  ListTodo,
  Ticket,
  CheckCircle2,
  Loader2,
  Search,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function TasksPage() {
  const { userProfile, refreshUserProfile } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!userProfile?.uid) return

      try {
        const [activeTasks, completedDoc] = await Promise.all([
          getActiveTasks(),
          getDoc(doc(db, 'userTasks', userProfile.uid)),
        ])

        setTasks(activeTasks)

        if (completedDoc.exists()) {
          setCompletedTaskIds(completedDoc.data().completedTasks || [])
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userProfile?.uid])

  const handleTaskComplete = async (taskId: string) => {
    if (!userProfile || completedTaskIds.includes(taskId)) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      // Mark task as completed
      const userTasksRef = doc(db, 'userTasks', userProfile.uid)
      const userTasksDoc = await getDoc(userTasksRef)

      if (userTasksDoc.exists()) {
        await updateDoc(userTasksRef, {
          completedTasks: [...completedTaskIds, taskId],
        })
      } else {
        await setDoc(userTasksRef, {
          completedTasks: [taskId],
        })
      }

      // Create tickets
      for (let i = 0; i < task.reward; i++) {
        await createTicket(
          userProfile.uid,
          userProfile.fullName || userProfile.displayName,
          userProfile.phone || '',
          userProfile.address || '',
          'task'
        )
      }

      // Update user stats
      await updateDoc(doc(db, 'users', userProfile.uid), {
        completedTasks: increment(1),
      })

      setCompletedTaskIds([...completedTaskIds, taskId])
      await refreshUserProfile()

      toast.success(`Task completed! You earned ${task.reward} ticket${task.reward > 1 ? 's' : ''}!`)
    } catch (error) {
      console.error('Error completing task:', error)
      toast.error('Failed to complete task')
    }
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableTasks = filteredTasks.filter((t) => !completedTaskIds.includes(t.id))
  const completedTasks = filteredTasks.filter((t) => completedTaskIds.includes(t.id))

  const totalRewardsAvailable = availableTasks.reduce((sum, t) => sum + t.reward, 0)

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
          <ListTodo className="w-8 h-8 text-primary" />
          Tasks
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete tasks to earn lottery tickets
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{tasks.length}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{completedTaskIds.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{availableTasks.length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Ticket className="w-5 h-5 text-primary" />
              <p className="text-2xl font-bold text-primary">{totalRewardsAvailable}</p>
            </div>
            <p className="text-xs text-muted-foreground">Tickets Available</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border/50"
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30">
            <TabsTrigger value="available" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Available ({availableTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            {availableTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleTaskComplete}
                    isCompleted={false}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-lg font-semibold">All tasks completed!</h3>
                <p className="text-muted-foreground mt-1">
                  Check back later for new tasks
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={true}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <ListTodo className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">No completed tasks yet</h3>
                <p className="text-muted-foreground mt-1">
                  Complete tasks to earn lottery tickets
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
