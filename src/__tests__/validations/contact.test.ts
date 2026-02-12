import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/validations/contact'

describe('contactSchema', () => {
  const validContact = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone: '555-1234',
    job_title: 'Engineer',
    status: 'active' as const,
  }

  it('accepts valid contact data', () => {
    const result = contactSchema.safeParse(validContact)
    expect(result.success).toBe(true)
  })

  it('requires first_name', () => {
    const result = contactSchema.safeParse({ ...validContact, first_name: '' })
    expect(result.success).toBe(false)
  })

  it('requires last_name', () => {
    const result = contactSchema.safeParse({ ...validContact, last_name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({ ...validContact, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('allows empty email', () => {
    const result = contactSchema.safeParse({ ...validContact, email: '' })
    expect(result.success).toBe(true)
  })

  it('allows missing email (optional)', () => {
    const { email, ...noEmail } = validContact
    const result = contactSchema.safeParse(noEmail)
    expect(result.success).toBe(true)
  })

  it('validates status enum', () => {
    const result = contactSchema.safeParse({ ...validContact, status: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('accepts valid status values', () => {
    for (const status of ['active', 'inactive', 'lead']) {
      const result = contactSchema.safeParse({ ...validContact, status })
      expect(result.success).toBe(true)
    }
  })

  it('defaults status to active', () => {
    const { status, ...noStatus } = validContact
    const result = contactSchema.safeParse(noStatus)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe('active')
    }
  })

  it('allows optional fields to be empty strings', () => {
    const result = contactSchema.safeParse({
      first_name: 'John',
      last_name: 'Doe',
      phone: '',
      job_title: '',
      source: '',
      address: '',
      city: '',
      state: '',
      country: '',
    })
    expect(result.success).toBe(true)
  })

  it('allows optional fields to be omitted', () => {
    const result = contactSchema.safeParse({
      first_name: 'John',
      last_name: 'Doe',
    })
    expect(result.success).toBe(true)
  })
})
