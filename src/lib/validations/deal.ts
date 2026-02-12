import { z } from 'zod'

export const dealSchema = z.object({
  title: z.string().min(1, 'Deal title is required').max(200),
  value: z.coerce.number().min(0, 'Value must be positive').optional(),
  currency: z.string().default('USD'),
  stage_id: z.string().uuid('Stage is required'),
  company_id: z.string().uuid().optional().or(z.literal('')),
  expected_close_date: z.string().optional().or(z.literal('')),
  probability: z.coerce.number().min(0).max(100).optional(),
  description: z.string().max(5000).optional().or(z.literal('')),
})

export type DealFormValues = z.infer<typeof dealSchema>

export const moveDealSchema = z.object({
  deal_id: z.string().uuid(),
  stage_id: z.string().uuid(),
  position: z.number().int().min(0),
})

export type MoveDealValues = z.infer<typeof moveDealSchema>
