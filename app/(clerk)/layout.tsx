import Footer from "@/components/Footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="w-full min-h-screen flex flex-col">
          <div className="flex-1 w-full flex justify-center items-center">
            {children}
          </div>
          <Footer />
        </main>
      </body>
    </html>
  )
}
