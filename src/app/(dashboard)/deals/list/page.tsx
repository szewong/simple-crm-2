import Link from "next/link"
import { Plus, DollarSign, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { SearchInput } from "@/components/shared/search-input"
import { EmptyState } from "@/components/shared/empty-state"
import { DealTable } from "@/components/deals/deal-table"
import { getDeals } from "@/lib/queries/deals"

export default async function DealsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const currentPage = Number(page) || 1

  const { deals, totalCount, pageSize } = await getDeals({
    page: currentPage,
    search: q,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        description={`${totalCount} total deals`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/deals">
                <LayoutGrid className="size-4" />
                Board View
              </Link>
            </Button>
            <Button asChild>
              <Link href="/deals/new">
                <Plus className="size-4" />
                Add Deal
              </Link>
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <SearchInput placeholder="Search deals..." />
      </div>

      {deals.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No deals found"
          description="Start your pipeline by creating your first deal."
          action={
            <Button asChild>
              <Link href="/deals/new">
                <Plus className="size-4" />
                Add Deal
              </Link>
            </Button>
          }
        />
      ) : (
        <DealTable
          deals={deals as any}
          totalCount={totalCount}
          page={currentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
