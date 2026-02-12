import { z } from 'zod'

export const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(10000),
  contact_id: z.string().uuid().optional().or(z.literal('')),
  company_id: z.string().uuid().optional().or(z.literal('')),
  deal_id: z.string().uuid().optional().or(z.literal('')),
})

export type NoteFormValues = z.infer<typeof noteSchema>
