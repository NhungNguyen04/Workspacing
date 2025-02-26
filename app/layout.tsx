import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'
import { Metadata } from 'next'
import {ToastContainer } from 'react-toastify' // Import Toaster component
import 'react-toastify/dist/ReactToastify.css' // Add this line to import styles

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
        <body className={`${inter.className} min-h-screen flex flex-col`}>
          <main className="flex-1">
            {children}
          </main>
          <ToastContainer />
        </body>
      </html>
    </ClerkProvider>
  )
}