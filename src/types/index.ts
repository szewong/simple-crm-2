import type { Database } from './database'

// Row types (data from DB)
export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']

export type Company = Database['public']['Tables']['companies']['Row']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']
export type CompanyUpdate = Database['public']['Tables']['companies']['Update']

export type Deal = Database['public']['Tables']['deals']['Row']
export type DealInsert = Database['public']['Tables']['deals']['Insert']
export type DealUpdate = Database['public']['Tables']['deals']['Update']

export type DealStage = Database['public']['Tables']['deal_stages']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type ActivityInsert = Database['public']['Tables']['activities']['Insert']
export type ActivityUpdate = Database['public']['Tables']['activities']['Update']

export type Note = Database['public']['Tables']['notes']['Row']
export type NoteInsert = Database['public']['Tables']['notes']['Insert']
export type NoteUpdate = Database['public']['Tables']['notes']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']

export type DealContact = Database['public']['Tables']['deal_contacts']['Row']

// Joined types for common queries
export type ContactWithCompany = Contact & {
  company: Pick<Company, 'id' | 'name'> | null
}

export type DealWithStage = Deal & {
  stage: DealStage
}

export type DealWithDetails = Deal & {
  stage: DealStage
  company: Pick<Company, 'id' | 'name'> | null
  contacts: Pick<Contact, 'id' | 'first_name' | 'last_name'>[]
}
