import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

export const metadata: Metadata = {
  title: 'BitDeen - Premium Task-Based Lottery System',
  description: 'Complete tasks, earn lottery tickets, and win amazing prizes with BitDeen.',
  keywords: ['lottery', 'tasks', 'rewards', 'tickets', 'prizes', 'BitDeen'],
  authors: [{ name: 'BitDeen' }],
  openGraph: {
    title: 'BitDeen - Premium Task-Based Lottery System',
    description: 'Complete tasks, earn lottery tickets, and win amazing prizes.',
    type: 'website',
    images: ['https://i.imgur.com/VZmr8Dr.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BitDeen - Premium Task-Based Lottery System',
    description: 'Complete tasks, earn lottery tickets, and win amazing prizes.',
    images: ['https://i.imgur.com/VZmr8Dr.jpeg'],
  },
  icons: {
    icon: 'https://i.imgur.com/VZmr8Dr.jpeg',
    apple: 'https://i.imgur.com/VZmr8Dr.jpeg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#141414',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
