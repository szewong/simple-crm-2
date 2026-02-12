"use client"

import { ActivityItem } from "./activity-item"
import { isToday, isYesterday, isThisWeek, format } from "date-fns"

interface Activity {
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

interface ActivityTimelineProps {
  activities: Activity[]
}

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"
  if (isThisWeek(date)) return "This Week"
  return format(date, "MMMM yyyy")
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const grouped = activities.reduce<Record<string, Activity[]>>((acc, activity) => {
    const group = getDateGroup(activity.created_at)
    if (!acc[group]) acc[group] = []
    acc[group].push(activity)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group}>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {group}
          </h3>
          <div className="space-y-2">
            {items.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
