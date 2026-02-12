import { describe, it, expect } from 'vitest'
import { dealSchema } from '@/lib/validations/deal'

describe('dealSchema', () => {
  const validDeal = {
    title: 'Big Deal',
    value: 10000,
    currency: 'USD',
    stage_id: '550e8400-e29b-41d4-a716-446655440000',
    probability: 50,
  }

  it('accepts valid deal data', () => {
    const result = dealSchema.safeParse(validDeal)
    expect(result.success).toBe(true)
  })

  it('requires title', () => {
    const result = dealSchema.safeParse({ ...validDeal, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects negative value', () => {
    const result = dealSchema.safeParse({ ...validDeal, value: -100 })
    expect(result.success).toBe(false)
  })

  it('accepts zero value', () => {
    const result = dealSchema.safeParse({ ...validDeal, value: 0 })
    expect(result.success).toBe(true)
  })

  it('coerces string value to number', () => {
    const result = dealSchema.safeParse({ ...validDeal, value: '5000' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.value).toBe(5000)
    }
  })

  it('rejects probability over 100', () => {
    const result = dealSchema.safeParse({ ...validDeal, probability: 101 })
    expect(result.success).toBe(false)
  })

  it('rejects probability under 0', () => {
    const result = dealSchema.safeParse({ ...validDeal, probability: -1 })
    expect(result.success).toBe(false)
  })

  it('accepts probability at boundary values', () => {
    const result0 = dealSchema.safeParse({ ...validDeal, probability: 0 })
    expect(result0.success).toBe(true)

    const result100 = dealSchema.safeParse({ ...validDeal, probability: 100 })
    expect(result100.success).toBe(true)
  })

  it('requires stage_id to be a valid UUID', () => {
    const result = dealSchema.safeParse({ ...validDeal, stage_id: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('allows optional fields to be empty strings', () => {
    const result = dealSchema.safeParse({
      title: 'Big Deal',
      stage_id: '550e8400-e29b-41d4-a716-446655440000',
      company_id: '',
      expected_close_date: '',
      description: '',
    })
    expect(result.success).toBe(true)
  })
})
