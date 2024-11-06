import { Inter } from 'next/font/google'
import { ClerkProvider, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Metadata } from 'next'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })
import Head from 'next/head'

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    href: 'icon',
    icon: '/logo.ico'
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}