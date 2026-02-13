-- 005: Auto-seed deal stages on user signup
-- Updates handle_new_user() trigger to also seed default deal stages

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  PERFORM seed_deal_stages(NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill: seed deal stages for any existing users who don't have them
INSERT INTO deal_stages (user_id, name, display_order, color, is_won, is_lost)
SELECT p.id, s.name, s.display_order, s.color, s.is_won, s.is_lost
FROM profiles p
CROSS JOIN (VALUES
  ('Qualification', 0, '#6366f1', false, false),
  ('Meeting Scheduled', 1, '#8b5cf6', false, false),
  ('Proposal Sent', 2, '#a855f7', false, false),
  ('Negotiation', 3, '#f59e0b', false, false),
  ('Closed Won', 4, '#22c55e', true, false),
  ('Closed Lost', 5, '#ef4444', false, true)
) AS s(name, display_order, color, is_won, is_lost)
WHERE NOT EXISTS (
  SELECT 1 FROM deal_stages ds WHERE ds.user_id = p.id
)
ON CONFLICT DO NOTHING;
