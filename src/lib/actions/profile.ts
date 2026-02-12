'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const fullName = formData.get('full_name') as string
  const jobTitle = formData.get('job_title') as string
  const timezone = formData.get('timezone') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      job_title: jobTitle || null,
      timezone: timezone || 'UTC',
    })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/settings/profile')
  revalidatePath('/', 'layout')
}
