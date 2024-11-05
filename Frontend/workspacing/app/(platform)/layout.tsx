import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import '@/styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider >
            <html lang="en" >
                <body >
                    <header className="h-20">
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </header>
                    <main className="h-100vh flex items-center justify-center">{children}</main>
                </body>
            </html>
        </ClerkProvider>
    )
}