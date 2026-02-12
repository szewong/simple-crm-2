import { describe, it, expect } from 'vitest'
import { companySchema } from '@/lib/validations/company'

describe('companySchema', () => {
  const validCompany = {
    name: 'Acme Corp',
    domain: 'acme.com',
    industry: 'Technology',
    size: '50-100',
    phone: '555-0000',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    notes: 'Great company',
  }

  it('accepts valid company data', () => {
    const result = companySchema.safeParse(validCompany)
    expect(result.success).toBe(true)
  })

  it('requires name', () => {
    const result = companySchema.safeParse({ ...validCompany, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing name', () => {
    const { name, ...noName } = validCompany
    const result = companySchema.safeParse(noName)
    expect(result.success).toBe(false)
  })

  it('allows optional fields to be empty strings', () => {
    const result = companySchema.safeParse({
      name: 'Acme Corp',
      domain: '',
      industry: '',
      size: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      notes: '',
    })
    expect(result.success).toBe(true)
  })

  it('allows optional fields to be omitted', () => {
    const result = companySchema.safeParse({ name: 'Acme Corp' })
    expect(result.success).toBe(true)
  })

  it('rejects name exceeding max length', () => {
    const result = companySchema.safeParse({ name: 'A'.repeat(201) })
    expect(result.success).toBe(false)
  })
})
