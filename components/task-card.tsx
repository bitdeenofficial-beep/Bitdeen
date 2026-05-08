'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
ExternalLink,
Ticket,
CheckCircle2,
Youtube,
Facebook,
Instagram,
Send,
Twitter,
Music2
} from 'lucide-react'

import type { Task } from '@/lib/ticket-service'

interface TaskCardProps {
task: Task
onComplete?: (taskId: string) => void
isCompleted?: boolean
index?: number
}

const platformIcons: Record<string, any> = {
youtube: Youtube,
facebook: Facebook,
instagram: Instagram,
telegram: Send,
twitter: Twitter,
tiktok: Music2
}

const platformColors: Record<string,string> = {
youtube:'from-red-500/20 to-red-500/5 border-red-500/20',
facebook:'from-blue-600/20 to-blue-600/5 border-blue-600/20',
instagram:'from-pink-500/20 to-pink-500/5 border-pink-500/20',
telegram:'from-sky-500/20 to-sky-500/5 border-sky-500/20',
twitter:'from-blue-400/20 to-blue-400/5 border-blue-400/20',
tiktok:'from-purple-500/20 to-purple-500/5 border-purple-500/20',
default:'from-primary/20 to-primary/5 border-primary/20'
}

export function TaskCard({
task,
onComplete,
isCompleted=false,
index=0
}:TaskCardProps){

const [opened,setOpened] = useState(false)
const [loading,setLoading] = useState(false)

const Icon =
platformIcons[task.platform.toLowerCase()] || ExternalLink

const colorClass =
platformColors[task.platform.toLowerCase()] || platformColors.default

const openTask = ()=>{

window.open(task.link,'_blank')

setOpened(true)

}

const verifyTask = ()=>{

if(!opened){
alert('Please open the task first')
return
}

if(isCompleted || loading) return

setLoading(true)

setTimeout(()=>{

onComplete?.(task.id)

setLoading(false)

},2000)

}

return(

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
transition={{delay:index*0.05}}
className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClass} border p-5`}
>

<div className="flex items-start gap-4">

<div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0">

<Icon className="w-6 h-6"/>

</div>

<div className="flex-1">

<h3 className="font-semibold text-base">
{task.title}
</h3>

<p className="text-sm text-muted-foreground mt-1">

{task.description}

</p>

<div className="mt-4 flex items-center gap-3">

{isCompleted ?(

<div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">

<CheckCircle2 className="w-5 h-5"/>

Completed

</div>

):(

<>

<Button
size="sm"
onClick={openTask}
className="bg-primary text-primary-foreground"
>

<ExternalLink className="w-4 h-4 mr-2"/>

Open

</Button>

<Button
size="sm"
onClick={verifyTask}
disabled={loading}
variant="secondary"
>

{loading?'Checking...':'Verify'}

</Button>

</>

)}

</div>

</div>

</div>

{task.imageUrl &&(

<div className="mt-4 relative aspect-video rounded-xl overflow-hidden">

<Image
src={task.imageUrl}
alt={task.title}
fill
className="object-cover"
/>

</div>

)}

</motion.div>

)

}



interface ActivationTaskCardProps{

platform:string
title:string
link:string
isCompleted:boolean
onComplete:()=>void
index?:number

}

export function ActivationTaskCard({

platform,
title,
link,
isCompleted,
onComplete,
index=0

}:ActivationTaskCardProps){

const [opened,setOpened] = useState(false)
const [loading,setLoading] = useState(false)

const Icon =
platformIcons[platform.toLowerCase()] || ExternalLink

const colorClass =
platformColors[platform.toLowerCase()] || platformColors.default

const openTask = ()=>{

window.open(link,'_blank')

setOpened(true)

}

const verifyTask = ()=>{

if(!opened){

alert('Open task first')

return

}

if(isCompleted || loading) return

setLoading(true)

setTimeout(()=>{

onComplete()

setLoading(false)

},2000)

}

return(

<motion.div
initial={{opacity:0,x:-20}}
animate={{opacity:1,x:0}}
transition={{delay:index*0.1}}
className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${colorClass} border p-4`}
>

<div className="flex items-center gap-4">

<div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center shrink-0">

<Icon className="w-6 h-6"/>

</div>

<div className="flex-1">

<h3 className="font-semibold">
{title}
</h3>

<p className="text-sm text-muted-foreground capitalize">

{platform}

</p>

</div>

{isCompleted ?(

<div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">

<CheckCircle2 className="w-5 h-5 text-emerald-400"/>

</div>

):(

<div className="flex gap-2">

<Button
size="icon"
onClick={openTask}
className="w-10 h-10 rounded-full"
>

<ExternalLink className="w-4 h-4"/>

</Button>

<Button
size="icon"
onClick={verifyTask}
disabled={loading}
variant="secondary"
className="w-10 h-10 rounded-full"
>

{loading?'...':'✓'}

</Button>

</div>

)}

</div>

</motion.div>

)

}
