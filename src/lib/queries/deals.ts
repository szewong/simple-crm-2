import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 20

export async function getDeals({
  page = 1,
  search,
  stageId,
}: {
  page?: number
  search?: string
  stageId?: string
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('deals')
    .select('*, stage:deal_stages(*), company:companies(id, name)', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }
  if (stageId) {
    query = query.eq('stage_id', stageId)
  }

  const { data, count, error } = await query

  if (error) throw error

  return { deals: data ?? [], totalCount: count ?? 0, pageSize: PAGE_SIZE }
}

export async function getDeal(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deals')
    .select('*, stage:deal_stages(*), company:companies(id, name)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getDealsByStage() {
  const supabase = await createClient()

  const [stagesResult, dealsResult] = await Promise.all([
    supabase
      .from('deal_stages')
      .select('*')
      .order('display_order', { ascending: true }),
    supabase
      .from('deals')
      .select('*, stage:deal_stages(*), company:companies(id, name)')
      .order('position', { ascending: true }),
  ])

  if (stagesResult.error) throw stagesResult.error
  if (dealsResult.error) throw dealsResult.error

  const stages = stagesResult.data ?? []
  const deals = dealsResult.data ?? []

  return stages.map((stage) => ({
    ...stage,
    deals: deals.filter((deal) => deal.stage_id === stage.id),
  }))
}

export async function getDealStages() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deal_stages')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getDealContacts(dealId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deal_contacts')
    .select('*, contact:contacts(id, first_name, last_name, email)')
    .eq('deal_id', dealId)

  if (error) throw error
  return data ?? []
}
