import { z } from 'zod'

export const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  job_title: z.string().max(100).optional().or(z.literal('')),
  company_id: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'lead']).default('active'),
  source: z.string().max(50).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
})

export type ContactFormValues = z.infer<typeof contactSchema>
