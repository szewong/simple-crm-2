import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/shared/page-header"
import { ProfileForm } from "@/components/settings/profile-form"

export default async function ProfileSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your profile information"
      />
      <ProfileForm
        profile={{
          full_name: profile?.full_name ?? "",
          job_title: profile?.job_title ?? "",
          timezone: profile?.timezone ?? "UTC",
        }}
        email={user.email ?? ""}
      />
    </div>
  )
}
