import { getActivities } from "@/lib/queries/activities"
import { getContactsForSelect } from "@/lib/queries/contacts"
import { ActivitiesClient } from "@/components/activities/activities-client"

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; page?: string }>
}) {
  const { type, page } = await searchParams
  const currentPage = Number(page) || 1

  const [{ activities, totalCount, pageSize }, contacts] = await Promise.all([
    getActivities({
      page: currentPage,
      type: type || undefined,
    }),
    getContactsForSelect(),
  ])

  return (
    <ActivitiesClient
      activities={activities}
      contacts={contacts}
      totalCount={totalCount}
      page={currentPage}
      pageSize={pageSize}
      currentType={type || ""}
    />
  )
}
