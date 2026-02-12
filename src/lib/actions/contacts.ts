'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validations/contact'

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = contactSchema.parse(raw)

  // Clean empty strings to null for optional UUID fields
  const companyId = validated.company_id || null

  const { error } = await supabase.from('contacts').insert({
    ...validated,
    company_id: companyId,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/contacts')
  revalidatePath('/dashboard')
}

export async function updateContact(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = contactSchema.parse(raw)

  const companyId = validated.company_id || null

  const { error } = await supabase
    .from('contacts')
    .update({ ...validated, company_id: companyId })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/contacts')
  revalidatePath(`/contacts/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('contacts').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/contacts')
  revalidatePath('/dashboard')
}
