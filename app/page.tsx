import { auth } from "@clerk/nextjs/server"
import WorkspaceLayout from "@/components/workspace-layout"

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return null // or redirect to sign-in page
  }

  return (
    <WorkspaceLayout>
      <div className="h-10000">
      <h1 className="text-2xl font-bold">Welcome to your Personal Workspace</h1>
      <p className="mt-4">This is your personal dashboard. Select an organization to switch to team workspace.</p>
      </div>
    </WorkspaceLayout>
  )
}