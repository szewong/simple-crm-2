'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { companySchema } from '@/lib/validations/company'

export async function createCompany(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = companySchema.parse(raw)

  const { error } = await supabase.from('companies').insert({
    ...validated,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/companies')
  revalidatePath('/dashboard')
}

export async function updateCompany(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = companySchema.parse(raw)

  const { error } = await supabase
    .from('companies')
    .update(validated)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/companies')
  revalidatePath(`/companies/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteCompany(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('companies').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/companies')
  revalidatePath('/dashboard')
}
