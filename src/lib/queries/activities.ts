import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 20

export async function getActivities({
  page = 1,
  search,
  type,
  completed,
  contactId,
  dealId,
}: {
  page?: number
  search?: string
  type?: string
  completed?: boolean
  contactId?: string
  dealId?: string
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('activities')
    .select(
      '*, contact:contacts(id, first_name, last_name), deal:deals(id, title)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }
  if (type) {
    query = query.eq('type', type)
  }
  if (completed !== undefined) {
    query = query.eq('is_completed', completed)
  }
  if (contactId) {
    query = query.eq('contact_id', contactId)
  }
  if (dealId) {
    query = query.eq('deal_id', dealId)
  }

  const { data, count, error } = await query

  if (error) throw error

  return {
    activities: data ?? [],
    totalCount: count ?? 0,
    pageSize: PAGE_SIZE,
  }
}

export async function getActivity(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activities')
    .select(
      '*, contact:contacts(id, first_name, last_name), deal:deals(id, title)'
    )
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getUpcomingActivities(limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activities')
    .select(
      '*, contact:contacts(id, first_name, last_name), deal:deals(id, title)'
    )
    .eq('is_completed', false)
    .gte('due_date', new Date().toISOString())
    .order('due_date', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getOverdueActivities() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activities')
    .select(
      '*, contact:contacts(id, first_name, last_name), deal:deals(id, title)'
    )
    .eq('is_completed', false)
    .lt('due_date', new Date().toISOString())
    .order('due_date', { ascending: true })

  if (error) throw error
  return data ?? []
}
