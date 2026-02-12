import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getContact } from "@/lib/queries/contacts"
import { getActivities } from "@/lib/queries/activities"
import { getInitials, formatDate, formatRelativeDate } from "@/lib/utils"
import { NoteSection } from "@/components/contacts/note-section"
import { createClient } from "@/lib/supabase/server"

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success-foreground border-success/20",
  inactive: "bg-muted text-muted-foreground",
  lead: "bg-info/10 text-info-foreground border-info/20",
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let contact
  try {
    contact = await getContact(id)
  } catch {
    notFound()
  }

  const { activities } = await getActivities({ contactId: id })

  const supabase = await createClient()
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("contact_id", id)
    .order("created_at", { ascending: false })

  const { data: deals } = await supabase
    .from("deals")
    .select("*, stage:deal_stages(*)")
    .in(
      "id",
      (
        await supabase
          .from("deal_contacts")
          .select("deal_id")
          .eq("contact_id", id)
      ).data?.map((dc) => dc.deal_id) ?? []
    )

  const fullName = `${contact.first_name} ${contact.last_name}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/contacts">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex flex-1 items-center gap-4">
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{fullName}</h1>
              <Badge
                variant="outline"
                className={statusColors[contact.status] || ""}
              >
                {contact.status}
              </Badge>
            </div>
            {(contact.job_title || contact.company) && (
              <p className="text-sm text-muted-foreground">
                {contact.job_title}
                {contact.job_title && contact.company ? " @ " : ""}
                {contact.company && (
                  <Link
                    href={`/companies/${contact.company.id}`}
                    className="hover:underline"
                  >
                    {contact.company.name}
                  </Link>
                )}
              </p>
            )}
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              {contact.email && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3.5" /> {contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="size-3.5" /> {contact.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/contacts/${id}/edit`}>
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
          <TabsTrigger value="deals">
            Deals ({deals?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({notes?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">First Name</dt>
                  <dd className="text-sm font-medium">{contact.first_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Last Name</dt>
                  <dd className="text-sm font-medium">{contact.last_name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="text-sm font-medium">{contact.email || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="text-sm font-medium">{contact.phone || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Job Title</dt>
                  <dd className="text-sm font-medium">{contact.job_title || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Company</dt>
                  <dd className="text-sm font-medium">
                    {contact.company?.name || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="text-sm font-medium capitalize">{contact.status}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Source</dt>
                  <dd className="text-sm font-medium capitalize">
                    {contact.source || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd className="text-sm font-medium">
                    {formatDate(contact.created_at)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
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

        <TabsContent value="deals" className="mt-6 space-y-3">
          {!deals || deals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No associated deals.
            </p>
          ) : (
            deals.map((deal) => (
              <Link key={deal.id} href={`/deals/${deal.id}`}>
                <Card className="py-3 transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center justify-between px-4">
                    <div>
                      <p className="text-sm font-medium">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {(deal.stage as { name: string })?.name}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {deal.value ? `$${Number(deal.value).toLocaleString()}` : "-"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NoteSection notes={notes ?? []} contactId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
