"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
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
import { deleteDeal } from "@/lib/actions/deals"
import { formatCurrency, formatDate } from "@/lib/utils"

interface DealForTable {
  id: string
  title: string
  value: number | null
  expected_close_date: string | null
  stage: { name: string; color: string | null } | null
  company: { id: string; name: string } | null
}

interface DealTableProps {
  deals: DealForTable[]
  totalCount: number
  page: number
  pageSize: number
}

export function DealTable({ deals, totalCount, page, pageSize }: DealTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize)

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteDeal(deleteId)
      toast.success("Deal deleted")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete deal")
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
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="hidden md:table-cell">Expected Close</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow
                key={deal.id}
                className="cursor-pointer"
                onClick={() => router.push(`/deals/${deal.id}`)}
              >
                <TableCell className="font-medium">{deal.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {deal.company?.name || "-"}
                </TableCell>
                <TableCell className="font-semibold">
                  {deal.value != null ? formatCurrency(deal.value) : "-"}
                </TableCell>
                <TableCell>
                  {deal.stage && (
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: deal.stage.color
                          ? `${deal.stage.color}20`
                          : undefined,
                        color: deal.stage.color || undefined,
                      }}
                    >
                      {deal.stage.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {deal.expected_close_date
                    ? formatDate(deal.expected_close_date)
                    : "-"}
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
                          router.push(`/deals/${deal.id}`)
                        }}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(deal.id)
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
        title="Delete Deal"
        description="Are you sure you want to delete this deal? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
