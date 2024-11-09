import WorkspaceLayout from "@/components/workspace-layout"

export default function TeamspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>
}