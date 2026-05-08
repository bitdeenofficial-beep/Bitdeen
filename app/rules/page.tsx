'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import { Card,CardContent } from '@/components/ui/card'
import { BookOpen,CheckCircle2,AlertTriangle,Ticket } from 'lucide-react'

export default function RulesPage(){

return(

<div className="min-h-screen islamic-pattern">

<ThreeBackgroundSimple/>

<Navbar/>

<main className="pt-24 pb-16 px-4">

<div className="max-w-4xl mx-auto">

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="text-center mb-12"
>

<h1 className="text-4xl font-bold">

Rules & Guidelines

</h1>

</motion.div>

<Card>

<CardContent className="p-8">

<h2 className="text-xl font-bold mb-4">

Activation Rules

</h2>

<ul className="space-y-3">

<li className="flex gap-3">

<CheckCircle2 className="w-5 h-5 text-primary"/>

User must complete all 6 activation tasks

</li>

<li className="flex gap-3">

<CheckCircle2 className="w-5 h-5 text-primary"/>

Activation only required once

</li>

<li className="flex gap-3">

<CheckCircle2 className="w-5 h-5 text-primary"/>

After activation user can access dashboard

</li>

<li className="flex gap-3">

<CheckCircle2 className="w-5 h-5 text-primary"/>

Activation reward is 1 lottery ticket

</li>

</ul>

</CardContent>

</Card>

<Card className="mt-6 bg-destructive/10 border-destructive/30">

<CardContent className="p-8">

<h2 className="text-xl font-bold mb-4 flex gap-2">

<AlertTriangle/>

Prohibited

</h2>

<ul className="space-y-3">

<li>Multiple accounts</li>

<li>Using bots</li>

<li>Fake task completion</li>

<li>System manipulation</li>

</ul>

</CardContent>

</Card>

</div>

</main>

</div>

)

}
