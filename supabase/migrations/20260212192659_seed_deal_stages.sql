-- 004: Seed Deal Stages Function
-- Creates default deal stages for a new user

CREATE OR REPLACE FUNCTION seed_deal_stages(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO deal_stages (user_id, name, display_order, color, is_won, is_lost) VALUES
    (p_user_id, 'Qualification', 0, '#6366f1', false, false),
    (p_user_id, 'Meeting Scheduled', 1, '#8b5cf6', false, false),
    (p_user_id, 'Proposal Sent', 2, '#a855f7', false, false),
    (p_user_id, 'Negotiation', 3, '#f59e0b', false, false),
    (p_user_id, 'Closed Won', 4, '#22c55e', true, false),
    (p_user_id, 'Closed Lost', 5, '#ef4444', false, true)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
