-- 003: Performance Indexes

-- Contacts
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_status ON contacts(user_id, status);
CREATE INDEX idx_contacts_name ON contacts(user_id, last_name, first_name);

-- Companies
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_name ON companies(user_id, name);

-- Deals
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_stage_id ON deals(stage_id);
CREATE INDEX idx_deals_company_id ON deals(company_id);
CREATE INDEX idx_deals_stage_position ON deals(user_id, stage_id, position);

-- Activities
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_contact_id ON activities(contact_id);
CREATE INDEX idx_activities_deal_id ON activities(deal_id);
CREATE INDEX idx_activities_due_date ON activities(user_id, due_date) WHERE NOT is_completed;

-- Notes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_contact_id ON notes(contact_id);
CREATE INDEX idx_notes_deal_id ON notes(deal_id);
CREATE INDEX idx_notes_company_id ON notes(company_id);

-- Deal Stages
CREATE INDEX idx_deal_stages_user_order ON deal_stages(user_id, display_order);
