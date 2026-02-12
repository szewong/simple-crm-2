"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { deleteContact } from "@/lib/actions/contacts"
import { getInitials } from "@/lib/utils"
import type { ContactWithCompany } from "@/types"

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success-foreground border-success/20",
  inactive: "bg-muted text-muted-foreground",
  lead: "bg-info/10 text-info-foreground border-info/20",
}

interface ContactTableProps {
  contacts: ContactWithCompany[]
  totalCount: number
  page: number
  pageSize: number
}

export function ContactTable({ contacts, totalCount, page, pageSize }: ContactTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize)

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteContact(deleteId)
      toast.success("Contact deleted")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete contact")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                key={contact.id}
                className="cursor-pointer"
                onClick={() => router.push(`/contacts/${contact.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(`${contact.first_name} ${contact.last_name}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </p>
                      {contact.job_title && (
                        <p className="text-xs text-muted-foreground">{contact.job_title}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contact.company?.name || "-"}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {contact.email || "-"}
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {contact.phone || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusColors[contact.status] || ""}
                  >
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/contacts/${contact.id}`)
                        }}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(contact.id)
                        }}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} of{" "}
            {totalCount}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => router.push(`?page=${page - 1}`)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => router.push(`?page=${page + 1}`)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
