import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Building2, Calendar, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDeal, getDealContacts } from "@/lib/queries/deals"
import { getActivities } from "@/lib/queries/activities"
import { formatCurrency, formatDate, formatRelativeDate } from "@/lib/utils"
import { NoteSection } from "@/components/contacts/note-section"
import { createClient } from "@/lib/supabase/server"

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let deal
  try {
    deal = await getDeal(id)
  } catch {
    notFound()
  }

  const [dealContacts, { activities }] = await Promise.all([
    getDealContacts(id),
    getActivities({ dealId: id }),
  ])

  const supabase = await createClient()
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("deal_id", id)
    .order("created_at", { ascending: false })

  const stage = deal.stage as { name: string; color: string | null } | null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/deals">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{deal.title}</h1>
            {stage && (
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: stage.color ? `${stage.color}20` : undefined,
                  color: stage.color || undefined,
                }}
              >
                {stage.name}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            {deal.value != null && (
              <span className="font-semibold text-foreground">
                {formatCurrency(Number(deal.value))}
              </span>
            )}
            {deal.company && (
              <span className="flex items-center gap-1">
                <Building2 className="size-3.5" />
                <Link
                  href={`/companies/${(deal.company as { id: string }).id}`}
                  className="hover:underline"
                >
                  {(deal.company as { name: string }).name}
                </Link>
              </span>
            )}
            {deal.expected_close_date && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(deal.expected_close_date)}
              </span>
            )}
            {deal.probability != null && (
              <span className="flex items-center gap-1">
                <Percent className="size-3.5" />
                {deal.probability}%
              </span>
            )}
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/deals/${id}/edit`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList variant="line">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="activities">
            Activities ({activities.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({notes?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Title</dt>
                    <dd className="text-sm font-medium">{deal.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Value</dt>
                    <dd className="text-sm font-medium">
                      {deal.value != null ? formatCurrency(Number(deal.value)) : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Stage</dt>
                    <dd className="text-sm font-medium">{stage?.name || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Probability</dt>
                    <dd className="text-sm font-medium">
                      {deal.probability != null ? `${deal.probability}%` : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Expected Close</dt>
                    <dd className="text-sm font-medium">
                      {formatDate(deal.expected_close_date) || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Created</dt>
                    <dd className="text-sm font-medium">
                      {formatDate(deal.created_at)}
                    </dd>
                  </div>
                  {deal.description && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm text-muted-foreground">Description</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-sm">
                        {deal.description}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Contacts ({dealContacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dealContacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No contacts linked to this deal.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dealContacts.map((dc) => {
                      const contact = dc.contact as {
                        id: string
                        first_name: string
                        last_name: string
                        email: string | null
                      } | null
                      if (!contact) return null
                      return (
                        <Link
                          key={contact.id}
                          href={`/contacts/${contact.id}`}
                          className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {contact.first_name} {contact.last_name}
                            </p>
                            {contact.email && (
                              <p className="text-xs text-muted-foreground">
                                {contact.email}
                              </p>
                            )}
                          </div>
                          {dc.role && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {dc.role}
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6 space-y-3">
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No activities yet.
            </p>
          ) : (
            activities.map((activity) => (
              <Card key={activity.id} className="py-3">
                <CardContent className="flex items-start gap-3 px-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{activity.type}</Badge>
                      <span className="text-sm font-medium">{activity.title}</span>
                    </div>
                    {activity.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatRelativeDate(activity.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NoteSection notes={notes ?? []} dealId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
