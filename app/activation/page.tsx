'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { createTicket } from '@/lib/ticket-service'
import { Button } from '@/components/ui/button'
import { ActivationTaskCard } from '@/components/task-card'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { toast } from 'sonner'
import {
CheckCircle2,
Ticket,
Loader2,
Gift,
Sparkles
} from 'lucide-react'

const activationTasks = [
{
id: 'youtube',
platform: 'youtube',
title: 'Subscribe YouTube',
link: 'https://youtube.com/@bitdeen'
},
{
id: 'facebook',
platform: 'facebook',
title: 'Follow Facebook',
link: 'https://facebook.com/bitdeen'
},
{
id: 'telegram',
platform: 'telegram',
title: 'Join Telegram',
link: 'https://t.me/bitdeen'
},
{
id: 'twitter',
platform: 'twitter',
title: 'Follow Twitter',
link: 'https://twitter.com/bitdeen'
},
{
id: 'instagram',
platform: 'instagram',
title: 'Follow Instagram',
link: 'https://instagram.com/bitdeen'
},
{
id: 'tiktok',
platform: 'tiktok',
title: 'Follow TikTok',
link: 'https://tiktok.com/@bitdeen'
}
]

export default function ActivationPage() {

const router = useRouter()

const {
user,
userProfile,
updateUserProfile,
refreshUserProfile,
loading: authLoading
} = useAuth()

const [completedTasks,setCompletedTasks] = useState<string[]>([])
const [openedTasks,setOpenedTasks] = useState<string[]>([])
const [claiming,setClaiming] = useState(false)

useEffect(()=>{

if(!authLoading && !user){
router.push('/login')
}

if(!authLoading && user && !userProfile?.profileCompleted){
router.push('/complete-profile')
}

if(userProfile?.activationCompleted){
router.push('/dashboard')
}

},[user,userProfile,authLoading,router])

const openTask = (taskId:string,link:string)=>{

window.open(link,'_blank')

if(!openedTasks.includes(taskId)){
setOpenedTasks(prev=>[...prev,taskId])
}

}

const completeTask = (taskId:string)=>{

if(!openedTasks.includes(taskId)){
toast.error('Please open the task first')
return
}

if(!completedTasks.includes(taskId)){
setCompletedTasks(prev=>[...prev,taskId])
toast.success('Task verified')
}

}

const allTasksCompleted =
completedTasks.length === activationTasks.length

const handleClaimReward = async()=>{

if(!allTasksCompleted) return

if(!userProfile) return

setClaiming(true)

try{

await createTicket(
userProfile.uid,
userProfile.fullName || userProfile.displayName,
userProfile.phone || '',
userProfile.address || '',
'activation'
)

await updateUserProfile({
activationCompleted:true
})

await refreshUserProfile()

toast.success('Activation successful')

router.push('/dashboard')

}catch{

toast.error('Activation failed')

}

finally{
setClaiming(false)
}

}

if(authLoading){
return(
<div className="min-h-screen flex items-center justify-center">
<Loader2 className="w-8 h-8 animate-spin text-primary"/>
</div>
)
}

return(

<div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden islamic-pattern">

<ThreeBackgroundSimple/>

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="w-full max-w-lg"
>

<div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 card-glow">

<div className="flex flex-col items-center mb-8">

<div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/50 mb-4">

<Image
src="https://i.imgur.com/VZmr8Dr.jpeg"
alt="BitDeen Logo"
fill
className="object-cover"
/>

</div>

<h1 className="text-2xl font-bold text-gold-gradient">
Account Activation
</h1>

<p className="text-muted-foreground text-center mt-2 text-sm">

Complete all tasks to activate account

</p>

</div>

<div className="mb-6">

<div className="flex justify-between text-sm mb-2">

<span>Progress</span>

<span className="text-primary font-medium">

{completedTasks.length}/{activationTasks.length}

</span>

</div>

<div className="h-2 bg-muted rounded-full overflow-hidden">

<motion.div

animate={{
width:`${(completedTasks.length/activationTasks.length)*100}%`
}}

className="h-full bg-primary"

/>

</div>

</div>

<div className="space-y-3 mb-6">

{activationTasks.map((task,index)=>(

<ActivationTaskCard

key={task.id}

platform={task.platform}

title={task.title}

link={task.link}

opened={openedTasks.includes(task.id)}

isCompleted={completedTasks.includes(task.id)}

onOpen={()=>openTask(task.id,task.link)}

onComplete={()=>completeTask(task.id)}

index={index}

/>

))}

</div>

{allTasksCompleted ?(

<Button

onClick={handleClaimReward}

disabled={claiming}

className="w-full h-14 text-base font-semibold bg-primary text-white rounded-xl"

>

{claiming ?

<Loader2 className="animate-spin"/>

:

<>
<Sparkles className="w-5 h-5 mr-2"/>
Claim Ticket
</>

}

</Button>

):

<div className="text-center p-4 rounded-xl bg-muted/30">

Complete all tasks to activate

</div>

}

</div>

</motion.div>

</div>

)

}
