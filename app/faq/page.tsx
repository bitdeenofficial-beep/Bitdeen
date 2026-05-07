'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { ThreeBackgroundSimple } from '@/components/three-background'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: 'What is BitDeen?',
    answer: 'BitDeen is a task-based lottery ticket system where users complete simple social media tasks (like following channels, subscribing, etc.) to earn lottery tickets. These tickets enter you into regular lottery draws where you can win amazing prizes.',
  },
  {
    question: 'Is BitDeen free to use?',
    answer: 'Yes! BitDeen is completely free to join and participate. There is no purchase necessary to earn tickets or win prizes. You earn tickets by completing tasks, daily check-ins, referrals, and missions.',
  },
  {
    question: 'How do I earn lottery tickets?',
    answer: 'There are multiple ways to earn tickets: 1) Complete the activation tasks when you first sign up (1 ticket), 2) Daily check-in (1 ticket per day), 3) Refer friends (10 tickets per referral), 4) Complete social media tasks (varies), 5) Complete missions/milestones (1-100 tickets).',
  },
  {
    question: 'What is the ticket format?',
    answer: 'Each ticket has a unique ID in the format BT-YYYY-XXXXXX (e.g., BT-2026-000001). This ID is used to identify winning tickets during the lottery draw.',
  },
  {
    question: 'How does the lottery draw work?',
    answer: 'Lottery draws are conducted by our admin team and broadcast live on YouTube and Facebook. Winners are selected randomly from all active tickets. The draw schedule and prize information are announced in advance on our announcements page.',
  },
  {
    question: 'How will I know if I win?',
    answer: 'Winners are announced during the live draw and also posted on our Winners page. If you win, your winning ticket will be marked in your account, and we will contact you through your registered email and phone number.',
  },
  {
    question: 'What can I win?',
    answer: 'Prizes vary with each draw and can include cash prizes, electronics, gift cards, and more. Prize details are announced before each draw on our platform and social media channels.',
  },
  {
    question: 'How do referrals work?',
    answer: 'When you refer a friend using your unique referral code or link, and they complete their account activation, you automatically receive 10 lottery tickets. There is no limit to the number of friends you can refer!',
  },
  {
    question: 'What are missions?',
    answer: 'Missions are milestone rewards for completing tasks. Complete 10 tasks to earn 1 bonus ticket, 100 tasks for 10 tickets, and 1000 tasks for 100 tickets. Each mission can only be claimed once.',
  },
  {
    question: 'How do I claim my prize if I win?',
    answer: 'Our team will contact winning users through their registered contact information. Please ensure your profile has accurate contact details including your full name, phone number, and address for prize delivery.',
  },
  {
    question: 'Is my information safe?',
    answer: 'Yes, we take privacy seriously. Your personal information is securely stored and only used for account management and prize delivery. We never sell or share your data with third parties.',
  },
  {
    question: 'Can I use multiple accounts?',
    answer: 'No, each user is allowed only one account. Multiple accounts may result in disqualification and removal from the platform.',
  },
  {
    question: 'What happens if I miss the live draw?',
    answer: 'Do not worry! You do not need to watch the live draw to win. Winners are determined automatically, and results are posted on our Winners page. If you win, we will contact you.',
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach us at bitdeenofficial@gmail.com or through the Support Chat in your dashboard. We typically respond within 24-48 hours.',
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen islamic-pattern">
      <ThreeBackgroundSimple />
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-gold-gradient">Questions</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about BitDeen
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-xl px-6 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground">
              {"Still have questions? Contact us at "}
              <a href="mailto:bitdeenofficial@gmail.com" className="text-primary hover:underline">
                bitdeenofficial@gmail.com
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
