import { Suspense } from "react"
import Link from "next/link"
import {
  Users,
  DollarSign,
  TrendingUp,
  Trophy,
  ArrowRight,
  Phone,
  Mail,
  CalendarClock,
  CheckSquare,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"
import { getDashboardStats, getPipelineSummary } from "@/lib/queries/dashboard"
import { getUpcomingActivities } from "@/lib/queries/activities"
import { formatCurrency, formatRelativeDate } from "@/lib/utils"

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="py-4">
          <CardContent className="px-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function SectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

const metricIcons = [Users, DollarSign, TrendingUp, Trophy]

async function DashboardMetrics() {
  const stats = await getDashboardStats()

  const metrics = [
    { label: "Total Contacts", value: stats.totalContacts.toLocaleString(), icon: Users },
    { label: "Open Deals", value: stats.openDeals.toLocaleString(), icon: DollarSign },
    { label: "Pipeline Value", value: formatCurrency(stats.totalDealValue), icon: TrendingUp },
    { label: "Won This Month", value: formatCurrency(stats.wonDealValue), icon: Trophy },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="py-4">
          <CardContent className="flex items-center gap-4 px-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <metric.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function PipelineSummary() {
  const pipeline = await getPipelineSummary()

  if (pipeline.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deal Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No deal stages configured yet.</p>
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...pipeline.map((s) => s.dealCount), 1)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Deal Pipeline</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/deals">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {pipeline.map((stage) => (
          <div key={stage.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{stage.name}</span>
              <span className="text-muted-foreground">
                {stage.dealCount} deals &middot; {formatCurrency(stage.totalValue)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(stage.dealCount / maxCount) * 100}%`,
                  backgroundColor: stage.color || "hsl(var(--primary))",
                  minWidth: stage.dealCount > 0 ? "8px" : "0px",
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const activityTypeIcons: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: CalendarClock,
  task: CheckSquare,
  note: FileText,
}

async function UpcomingActivities() {
  const activities = await getUpcomingActivities(5)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Upcoming Activities</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/activities">
            View all <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming activities.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activityTypeIcons[activity.type] || CalendarClock
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      {activity.due_date && (
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeDate(activity.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your CRM activity"
      />

      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <PipelineSummary />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <UpcomingActivities />
        </Suspense>
      </div>
    </div>
  )
}
