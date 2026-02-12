import { PageHeader } from "@/components/shared/page-header"
import { ContactForm } from "@/components/contacts/contact-form"
import { getCompaniesForSelect } from "@/lib/queries/companies"

export default async function NewContactPage() {
  const companies = await getCompaniesForSelect()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="New Contact"
        description="Add a new contact to your CRM"
      />
      <ContactForm companies={companies} />
    </div>
  )
}
