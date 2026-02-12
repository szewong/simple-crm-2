'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { noteSchema } from '@/lib/validations/note'

export async function createNote(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = noteSchema.parse(raw)

  const contactId = validated.contact_id || null
  const companyId = validated.company_id || null
  const dealId = validated.deal_id || null

  const { error } = await supabase.from('notes').insert({
    content: validated.content,
    contact_id: contactId,
    company_id: companyId,
    deal_id: dealId,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  if (contactId) revalidatePath(`/contacts/${contactId}`)
  if (companyId) revalidatePath(`/companies/${companyId}`)
  if (dealId) revalidatePath(`/deals/${dealId}`)
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = noteSchema.parse(raw)

  const { error } = await supabase
    .from('notes')
    .update({ content: validated.content })
    .eq('id', id)

  if (error) throw new Error(error.message)

  if (validated.contact_id) revalidatePath(`/contacts/${validated.contact_id}`)
  if (validated.company_id)
    revalidatePath(`/companies/${validated.company_id}`)
  if (validated.deal_id) revalidatePath(`/deals/${validated.deal_id}`)
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get note to know what paths to revalidate
  const { data: note } = await supabase
    .from('notes')
    .select('contact_id, company_id, deal_id')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('notes').delete().eq('id', id)

  if (error) throw new Error(error.message)

  if (note?.contact_id) revalidatePath(`/contacts/${note.contact_id}`)
  if (note?.company_id) revalidatePath(`/companies/${note.company_id}`)
  if (note?.deal_id) revalidatePath(`/deals/${note.deal_id}`)
}
