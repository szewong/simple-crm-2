import { describe, it, expect } from 'vitest'
import { activitySchema } from '@/lib/validations/activity'

describe('activitySchema', () => {
  const validActivity = {
    type: 'call' as const,
    title: 'Follow up call',
    description: 'Check in with the client',
    due_date: '2025-06-15',
  }

  it('accepts valid activity data', () => {
    const result = activitySchema.safeParse(validActivity)
    expect(result.success).toBe(true)
  })

  it('requires title', () => {
    const result = activitySchema.safeParse({ ...validActivity, title: '' })
    expect(result.success).toBe(false)
  })

  it('validates type enum', () => {
    const result = activitySchema.safeParse({ ...validActivity, type: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('accepts all valid type values', () => {
    for (const type of ['call', 'email', 'meeting', 'task', 'note']) {
      const result = activitySchema.safeParse({ ...validActivity, type })
      expect(result.success).toBe(true)
    }
  })

  it('allows optional fields to be empty strings', () => {
    const result = activitySchema.safeParse({
      type: 'email',
      title: 'Send proposal',
      description: '',
      due_date: '',
      contact_id: '',
      deal_id: '',
    })
    expect(result.success).toBe(true)
  })

  it('allows optional fields to be omitted', () => {
    const result = activitySchema.safeParse({
      type: 'meeting',
      title: 'Team sync',
    })
    expect(result.success).toBe(true)
  })

  it('rejects title exceeding max length', () => {
    const result = activitySchema.safeParse({
      ...validActivity,
      title: 'A'.repeat(201),
    })
    expect(result.success).toBe(false)
  })
})
