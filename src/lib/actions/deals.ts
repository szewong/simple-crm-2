'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { dealSchema, moveDealSchema } from '@/lib/validations/deal'

export async function createDeal(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = dealSchema.parse(raw)

  const companyId = validated.company_id || null
  const expectedCloseDate = validated.expected_close_date || null

  const { error } = await supabase.from('deals').insert({
    title: validated.title,
    value: validated.value ?? null,
    currency: validated.currency,
    stage_id: validated.stage_id,
    company_id: companyId,
    expected_close_date: expectedCloseDate,
    probability: validated.probability ?? null,
    description: validated.description || null,
    user_id: user.id,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/deals')
  revalidatePath('/dashboard')
}

export async function updateDeal(id: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = dealSchema.parse(raw)

  const companyId = validated.company_id || null
  const expectedCloseDate = validated.expected_close_date || null

  const { error } = await supabase
    .from('deals')
    .update({
      title: validated.title,
      value: validated.value ?? null,
      currency: validated.currency,
      stage_id: validated.stage_id,
      company_id: companyId,
      expected_close_date: expectedCloseDate,
      probability: validated.probability ?? null,
      description: validated.description || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/deals')
  revalidatePath(`/deals/${id}`)
  revalidatePath('/dashboard')
}

export async function deleteDeal(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase.from('deals').delete().eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/deals')
  revalidatePath('/dashboard')
}

export async function moveDeal(data: {
  deal_id: string
  stage_id: string
  position: number
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = moveDealSchema.parse(data)

  const { error } = await supabase
    .from('deals')
    .update({
      stage_id: validated.stage_id,
      position: validated.position,
    })
    .eq('id', validated.deal_id)

  if (error) throw new Error(error.message)

  revalidatePath('/deals')
  revalidatePath('/dashboard')
}

export async function reorderDeals(
  updates: { id: string; position: number; stage_id: string }[]
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Update each deal's position
  const promises = updates.map((update) =>
    supabase
      .from('deals')
      .update({ position: update.position, stage_id: update.stage_id })
      .eq('id', update.id)
  )

  const results = await Promise.all(promises)
  const firstError = results.find((r) => r.error)
  if (firstError?.error) throw new Error(firstError.error.message)

  revalidatePath('/deals')
}
