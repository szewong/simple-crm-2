import Link from "next/link"
import { Plus, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { SearchInput } from "@/components/shared/search-input"
import { EmptyState } from "@/components/shared/empty-state"
import { CompanyTable } from "@/components/companies/company-table"
import { getCompanies } from "@/lib/queries/companies"

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const currentPage = Number(page) || 1

  const { companies, totalCount, pageSize } = await getCompanies({
    page: currentPage,
    search: q,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description={`${totalCount} total companies`}
        action={
          <Button asChild>
            <Link href="/companies/new">
              <Plus className="size-4" />
              Add Company
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <SearchInput placeholder="Search companies..." />
      </div>

      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add your first company to start organizing your contacts."
          action={
            <Button asChild>
              <Link href="/companies/new">
                <Plus className="size-4" />
                Add Company
              </Link>
            </Button>
          }
        />
      ) : (
        <CompanyTable
          companies={companies}
          totalCount={totalCount}
          page={currentPage}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
