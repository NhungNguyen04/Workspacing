import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { siteConfig} from '@/config/site'
import { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {

  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/logo.svg',
      href: '/logo.ico'
    }
  ]
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
     <body>
      {children}
    </body>
  </html>
  )
}