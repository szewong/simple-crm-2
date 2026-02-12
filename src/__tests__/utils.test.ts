import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatDate, formatRelativeDate, getInitials } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats a basic USD amount', () => {
    expect(formatCurrency(1000)).toBe('$1,000')
  })

  it('formats large amounts', () => {
    expect(formatCurrency(1234567)).toBe('$1,234,567')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('returns $0.00 for null', () => {
    expect(formatCurrency(null)).toBe('$0.00')
  })

  it('returns $0.00 for undefined', () => {
    expect(formatCurrency(undefined)).toBe('$0.00')
  })

  it('formats with EUR currency', () => {
    const result = formatCurrency(1000, 'EUR')
    expect(result).toContain('1,000')
  })

  it('formats with GBP currency', () => {
    const result = formatCurrency(500, 'GBP')
    expect(result).toContain('500')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    expect(formatDate('2025-01-15T12:00:00')).toBe('Jan 15, 2025')
  })

  it('formats a Date object', () => {
    expect(formatDate(new Date(2025, 5, 1))).toBe('Jun 1, 2025')
  })

  it('returns empty string for null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(formatDate('')).toBe('')
  })
})

describe('formatRelativeDate', () => {
  it('returns empty string for null', () => {
    expect(formatRelativeDate(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatRelativeDate(undefined)).toBe('')
  })

  it('returns a relative string for a recent date', () => {
    const now = new Date()
    const result = formatRelativeDate(now)
    expect(result).toContain('ago')
  })

  it('returns a relative string for an older date', () => {
    const oldDate = new Date('2020-01-01')
    const result = formatRelativeDate(oldDate)
    expect(result).toContain('ago')
  })
})

describe('getInitials', () => {
  it('gets initials from first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD')
  })

  it('gets single initial from single name', () => {
    expect(getInitials('John')).toBe('J')
  })

  it('gets max 2 initials from 3+ names', () => {
    expect(getInitials('John Michael Doe')).toBe('JM')
  })

  it('handles empty string', () => {
    expect(getInitials('')).toBe('')
  })

  it('uppercases initials', () => {
    expect(getInitials('john doe')).toBe('JD')
  })
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('merges tailwind classes correctly', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2')
  })

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })
})
