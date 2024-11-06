import {useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function DashboardPage() {

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your WorkSpacing dashboard. Get started by selecting a section from the sidebar.
      </p>
    </div>
  )
}