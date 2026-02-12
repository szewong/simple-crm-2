import { describe, it, expect } from 'vitest'
import { noteSchema } from '@/lib/validations/note'

describe('noteSchema', () => {
  const validNote = {
    content: 'This is a note about the contact.',
    contact_id: '550e8400-e29b-41d4-a716-446655440000',
  }

  it('accepts valid note data', () => {
    const result = noteSchema.safeParse(validNote)
    expect(result.success).toBe(true)
  })

  it('requires content', () => {
    const result = noteSchema.safeParse({ ...validNote, content: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing content', () => {
    const { content, ...noContent } = validNote
    const result = noteSchema.safeParse(noContent)
    expect(result.success).toBe(false)
  })

  it('accepts content up to max length', () => {
    const result = noteSchema.safeParse({ content: 'A'.repeat(10000) })
    expect(result.success).toBe(true)
  })

  it('rejects content exceeding max length', () => {
    const result = noteSchema.safeParse({ content: 'A'.repeat(10001) })
    expect(result.success).toBe(false)
  })

  it('allows optional association fields to be empty strings', () => {
    const result = noteSchema.safeParse({
      content: 'Some note',
      contact_id: '',
      company_id: '',
      deal_id: '',
    })
    expect(result.success).toBe(true)
  })

  it('allows optional association fields to be omitted', () => {
    const result = noteSchema.safeParse({ content: 'Some note' })
    expect(result.success).toBe(true)
  })
})
