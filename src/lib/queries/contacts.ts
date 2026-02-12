import { createClient } from '@/lib/supabase/server'

const PAGE_SIZE = 20

export async function getContacts({
  page = 1,
  search,
  status,
}: {
  page?: number
  search?: string
  status?: string
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('contacts')
    .select('*, company:companies(id, name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    )
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data, count, error } = await query

  if (error) throw error

  return { contacts: data ?? [], totalCount: count ?? 0, pageSize: PAGE_SIZE }
}

export async function getContact(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .select('*, company:companies(id, name)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getContactsForSelect() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('contacts')
    .select('id, first_name, last_name')
    .order('last_name', { ascending: true })

  if (error) throw error
  return data ?? []
}
