import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 20

export async function getCompanies({
  page = 1,
  search,
}: {
  page?: number
  search?: string
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('companies')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,domain.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw error

  return { companies: data ?? [], totalCount: count ?? 0, pageSize: PAGE_SIZE }
}

export async function getCompany(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getCompanyContacts(companyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', companyId)
    .order('last_name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getCompanyDeals(companyId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('deals')
    .select('*, stage:deal_stages(*)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getCompaniesForSelect() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}
