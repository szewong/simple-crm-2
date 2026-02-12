import { PageHeader } from "@/components/shared/page-header"
import { CompanyForm } from "@/components/companies/company-form"

export default function NewCompanyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="New Company"
        description="Add a new company to your CRM"
      />
      <CompanyForm />
    </div>
  )
}
