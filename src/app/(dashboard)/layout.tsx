import { redirect } from "next/navigation"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <NuqsAdapter>
      <SidebarProvider>
        <AppSidebar
          user={{
            email: user.email ?? "",
            name: profile?.full_name ?? user.email ?? "",
            avatarUrl: profile?.avatar_url ?? undefined,
          }}
        />
        <SidebarInset>
          <Header
            user={{
              email: user.email ?? "",
              name: profile?.full_name ?? user.email ?? "",
              avatarUrl: profile?.avatar_url ?? undefined,
            }}
          />
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  )
}
