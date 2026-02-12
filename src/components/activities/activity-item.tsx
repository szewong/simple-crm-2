"use client"

import { useState } from "react"
import { Phone, Mail, CalendarClock, CheckSquare, FileText, Check } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toggleActivityComplete } from "@/lib/actions/activities"
import { formatRelativeDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: CalendarClock,
  task: CheckSquare,
  note: FileText,
}

const typeColors: Record<string, string> = {
  call: "text-info",
  email: "text-purple-500",
  meeting: "text-warning",
  task: "text-success",
  note: "text-muted-foreground",
}

interface ActivityItemProps {
  activity: {
    id: string
    type: string
    title: string
    description: string | null
    due_date: string | null
    is_completed: boolean
    created_at: string
    contact?: { id: string; first_name: string; last_name: string } | null
    deal?: { id: string; title: string } | null
  }
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const [completed, setCompleted] = useState(activity.is_completed)
  const [toggling, setToggling] = useState(false)
  const Icon = typeIcons[activity.type] || CalendarClock

  const isOverdue =
    !completed &&
    activity.due_date &&
    new Date(activity.due_date) < new Date()

  async function handleToggle() {
    setToggling(true)
    const prev = completed
    setCompleted(!prev)
    try {
      await toggleActivityComplete(activity.id)
    } catch {
      setCompleted(prev)
      toast.error("Failed to update activity")
    } finally {
      setToggling(false)
    }
  }

  return (
    <Card className={cn("py-3", isOverdue && "border-destructive/50")}>
      <CardContent className="flex items-start gap-3 px-4">
        <Button
          variant="outline"
          size="icon-xs"
          className={cn(
            "mt-0.5 shrink-0",
            completed && "bg-success/10 text-success border-success/30"
          )}
          onClick={handleToggle}
          disabled={toggling}
        >
          {completed ? (
            <Check className="size-3" />
          ) : (
            <span className="size-3" />
          )}
        </Button>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className={cn("size-4", typeColors[activity.type])} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                completed && "line-through text-muted-foreground"
              )}
            >
              {activity.title}
            </span>
            <Badge variant="secondary" className="text-xs">
              {activity.type}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
          {activity.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.description}
            </p>
          )}
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            {activity.contact && (
              <span>
                {activity.contact.first_name} {activity.contact.last_name}
              </span>
            )}
            {activity.deal && <span>{activity.deal.title}</span>}
            {activity.due_date && (
              <span>{formatRelativeDate(activity.due_date)}</span>
            )}
            <span>{formatRelativeDate(activity.created_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
