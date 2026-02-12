import Link from "next/link"
import { Plus, DollarSign, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { DealBoard } from "@/components/deals/deal-board"
import { getDealsByStage } from "@/lib/queries/deals"

export default async function DealsPage() {
  const stagesWithDeals = await getDealsByStage()

  const totalDeals = stagesWithDeals.reduce(
    (sum, stage) => sum + stage.deals.length,
    0
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        description={`${totalDeals} total deals`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/deals/list">
                <List className="size-4" />
                Table View
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

      {totalDeals === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No deals yet"
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
        <DealBoard stages={stagesWithDeals} />
      )}
    </div>
  )
}
