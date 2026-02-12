import { PageHeader } from "@/components/shared/page-header"
import { DealForm } from "@/components/deals/deal-form"
import { getDealStages } from "@/lib/queries/deals"
import { getCompaniesForSelect } from "@/lib/queries/companies"

export default async function NewDealPage() {
  const [stages, companies] = await Promise.all([
    getDealStages(),
    getCompaniesForSelect(),
  ])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="New Deal"
        description="Create a new deal in your pipeline"
      />
      <DealForm stages={stages} companies={companies} />
    </div>
  )
}
