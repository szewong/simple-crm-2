import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()

  const [contacts, deals, activities, recentActivities] = await Promise.all([
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase.from('deals').select('id, value, stage:deal_stages(is_won)'),
    supabase
      .from('activities')
      .select('id', { count: 'exact', head: true })
      .eq('is_completed', false)
      .lt('due_date', new Date().toISOString()),
    supabase
      .from('activities')
      .select(
        '*, contact:contacts(id, first_name, last_name), deal:deals(id, title)'
      )
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const allDeals = deals.data ?? []
  const wonDeals = allDeals.filter(
    (d) => d.stage && typeof d.stage === 'object' && 'is_won' in d.stage && d.stage.is_won
  )

  return {
    totalContacts: contacts.count ?? 0,
    totalDealValue: allDeals.reduce(
      (sum, d) => sum + (Number(d.value) || 0),
      0
    ),
    wonDeals: wonDeals.length,
    wonDealValue: wonDeals.reduce(
      (sum, d) => sum + (Number(d.value) || 0),
      0
    ),
    openDeals: allDeals.length - wonDeals.length,
    overdueActivities: activities.count ?? 0,
    recentActivities: recentActivities.data ?? [],
  }
}

export async function getPipelineSummary() {
  const supabase = await createClient()

  const { data: stages, error: stagesError } = await supabase
    .from('deal_stages')
    .select('*')
    .order('display_order', { ascending: true })

  if (stagesError) throw stagesError

  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('stage_id, value')

  if (dealsError) throw dealsError

  return (stages ?? []).map((stage) => {
    const stageDeals = (deals ?? []).filter((d) => d.stage_id === stage.id)
    return {
      ...stage,
      dealCount: stageDeals.length,
      totalValue: stageDeals.reduce(
        (sum, d) => sum + (Number(d.value) || 0),
        0
      ),
    }
  })
}
