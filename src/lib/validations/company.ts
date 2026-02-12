import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200),
  domain: z.string().max(200).optional().or(z.literal('')),
  industry: z.string().max(100).optional().or(z.literal('')),
  size: z.string().max(20).optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  notes: z.string().max(5000).optional().or(z.literal('')),
})

export type CompanyFormValues = z.infer<typeof companySchema>
