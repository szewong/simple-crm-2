import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil, Globe, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getCompany, getCompanyContacts, getCompanyDeals } from "@/lib/queries/companies"
import { formatDate, formatCurrency, getInitials } from "@/lib/utils"
import { NoteSection } from "@/components/contacts/note-section"
import { createClient } from "@/lib/supabase/server"

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let company
  try {
    company = await getCompany(id)
  } catch {
    notFound()
  }

  const [contacts, deals] = await Promise.all([
    getCompanyContacts(id),
    getCompanyDeals(id),
  ])

  const supabase = await createClient()
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("company_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/companies">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{company.name}</h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            {company.industry && <span>{company.industry}</span>}
            {company.size && <span>{company.size} employees</span>}
            {company.domain && (
              <span className="flex items-center gap-1">
                <Globe className="size-3.5" /> {company.domain}
              </span>
            )}
            {company.phone && (
              <span className="flex items-center gap-1">
                <Phone className="size-3.5" /> {company.phone}
              </span>
            )}
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/companies/${id}/edit`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList variant="line">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="contacts">
            Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="deals">
            Deals ({deals.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            Notes ({notes?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Name</dt>
                  <dd className="text-sm font-medium">{company.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Domain</dt>
                  <dd className="text-sm font-medium">{company.domain || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Industry</dt>
                  <dd className="text-sm font-medium">{company.industry || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Size</dt>
                  <dd className="text-sm font-medium">{company.size || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="text-sm font-medium">{company.phone || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Location</dt>
                  <dd className="text-sm font-medium">
                    {[company.city, company.state, company.country]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Address</dt>
                  <dd className="text-sm font-medium">{company.address || "-"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Created</dt>
                  <dd className="text-sm font-medium">
                    {formatDate(company.created_at)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-6 space-y-3">
          {contacts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No contacts at this company.
            </p>
          ) : (
            contacts.map((contact) => (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <Card className="py-3 transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center gap-3 px-4">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(`${contact.first_name} ${contact.last_name}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {contact.first_name} {contact.last_name}
                      </p>
                      {contact.job_title && (
                        <p className="text-xs text-muted-foreground">
                          {contact.job_title}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {contact.status}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="deals" className="mt-6 space-y-3">
          {deals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No deals for this company.
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
                      {formatCurrency(Number(deal.value))}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NoteSection notes={notes ?? []} companyId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
