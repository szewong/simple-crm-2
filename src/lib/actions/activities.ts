'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { activitySchema } from '@/lib/validations/activity'

export async function createActivity(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = activitySchema.parse(raw)

  const contactId = validated.contact_id || null
  const dealId = validated.deal_id || null
  const dueDate = validated.due_date || null

  const { error } = await supabase.from('activities').insert({
    type: validated.type,
    title: validated.title,
    description: validated.description || null,
    due_date: dueDate,
    contact_id: contactId,
    deal_id: dealId,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/activities')
  revalidatePath('/dashboard')
}

export async function updateActivity(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = activitySchema.parse(raw)

  const contactId = validated.contact_id || null
  const dealId = validated.deal_id || null
  const dueDate = validated.due_date || null

  const { error } = await supabase
    .from('activities')
    .update({
      type: validated.type,
      title: validated.title,
      description: validated.description || null,
      due_date: dueDate,
      contact_id: contactId,
      deal_id: dealId,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/activities')
  revalidatePath('/dashboard')
}

export async function deleteActivity(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('activities').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/activities')
  revalidatePath('/dashboard')
}

export async function toggleActivityComplete(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Get current state
  const { data: activity, error: fetchError } = await supabase
    .from('activities')
    .select('is_completed')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const isCompleted = !activity.is_completed

  const { error } = await supabase
    .from('activities')
    .update({
      is_completed: isCompleted,
      completed_at: isCompleted ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/activities')
  revalidatePath('/dashboard')
}
