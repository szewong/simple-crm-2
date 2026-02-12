-- 002: Row Level Security Policies

-- ===========================================
-- profiles
-- ===========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ===========================================
-- companies
-- ===========================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own companies"
  ON companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own companies"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies"
  ON companies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies"
  ON companies FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- contacts
-- ===========================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- deal_stages
-- ===========================================
ALTER TABLE deal_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deal stages"
  ON deal_stages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deal stages"
  ON deal_stages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deal stages"
  ON deal_stages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deal stages"
  ON deal_stages FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- deals
-- ===========================================
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deals"
  ON deals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deals"
  ON deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals"
  ON deals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals"
  ON deals FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- deal_contacts
-- ===========================================
ALTER TABLE deal_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage deal_contacts for own deals"
  ON deal_contacts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM deals WHERE deals.id = deal_contacts.deal_id AND deals.user_id = auth.uid()
    )
  );

-- ===========================================
-- activities
-- ===========================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  USING (auth.uid() = user_id);

-- ===========================================
-- notes
-- ===========================================
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);
