import { auth } from "@clerk/nextjs/server"

export default async function TeamspacePage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null // or redirect to sign-in page
  }


  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome</h1>
      <p className="mt-4">This is your team workspace. Use the sidebar to navigate team features.</p>
    </div>
  )
}