"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, CalendarClock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActivityTimeline } from "./activity-timeline"
import { ActivityForm } from "./activity-form"

interface ActivitiesClientProps {
  activities: {
    id: string
    type: string
    title: string
    description: string | null
    due_date: string | null
    is_completed: boolean
    created_at: string
    contact?: { id: string; first_name: string; last_name: string } | null
    deal?: { id: string; title: string } | null
  }[]
  contacts: { id: string; first_name: string; last_name: string }[]
  totalCount: number
  page: number
  pageSize: number
  currentType: string
}

export function ActivitiesClient({
  activities,
  contacts,
  totalCount,
  page,
  pageSize,
  currentType,
}: ActivitiesClientProps) {
  const router = useRouter()
  const [formOpen, setFormOpen] = useState(false)
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activities"
        description={`${totalCount} total activities`}
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" />
            Log Activity
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <Select
          value={currentType || "all"}
          onValueChange={(val) => {
            const params = new URLSearchParams()
            if (val !== "all") params.set("type", val)
            router.push(`/activities?${params.toString()}`)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="call">Calls</SelectItem>
            <SelectItem value="email">Emails</SelectItem>
            <SelectItem value="meeting">Meetings</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No activities yet"
          description="Start logging your CRM activities to keep track of your interactions."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Log Activity
            </Button>
          }
        />
      ) : (
        <>
          <ActivityTimeline activities={activities} />

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * pageSize + 1}-
                {Math.min(page * pageSize, totalCount)} of {totalCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (currentType) params.set("type", currentType)
                    params.set("page", String(page - 1))
                    router.push(`/activities?${params.toString()}`)
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (currentType) params.set("type", currentType)
                    params.set("page", String(page + 1))
                    router.push(`/activities?${params.toString()}`)
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ActivityForm
        open={formOpen}
        onOpenChange={setFormOpen}
        contacts={contacts}
      />
    </div>
  )
}
