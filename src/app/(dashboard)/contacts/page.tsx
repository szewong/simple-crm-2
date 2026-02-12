import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { SearchInput } from "@/components/shared/search-input"
import { EmptyState } from "@/components/shared/empty-state"
import { ContactTable } from "@/components/contacts/contact-table"
import { getContacts } from "@/lib/queries/contacts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q, status, page } = await searchParams
  const currentPage = Number(page) || 1

  const { contacts, totalCount, pageSize } = await getContacts({
    page: currentPage,
    search: q,
    status,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description={`${totalCount} total contacts`}
        action={
          <Button asChild>
            <Link href="/contacts/new">
              <Plus className="size-4" />
              Add Contact
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchInput placeholder="Search contacts..." />
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts yet"
          description="Start building your network by adding your first contact."
          action={
            <Button asChild>
              <Link href="/contacts/new">
                <Plus className="size-4" />
                Add Contact
              </Link>
            </Button>
          }
        />
      ) : (
        <ContactTable
          contacts={contacts}
          totalCount={totalCount}
          page={currentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
