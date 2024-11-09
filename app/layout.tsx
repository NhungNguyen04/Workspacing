import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata : Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: '/logo.ico',
    href: '/logo.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}