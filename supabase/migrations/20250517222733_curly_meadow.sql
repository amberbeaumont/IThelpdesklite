/*
  # Initial HelpDesk Schema

  1. New Tables
    - `tickets`
      - `id` (uuid, primary key)
      - `requester_name` (text)
      - `requester_email` (text)
      - `problem_type` (text)
      - `urgency` (text)
      - `subject` (text)
      - `message` (text)
      - `attachment_name` (text, optional)
      - `attachment_url` (text, optional)
      - `status` (text)
      - `assigned_to` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ticket_comments`
      - `id` (uuid, primary key)
      - `ticket_id` (uuid, references tickets)
      - `user_id` (uuid, references auth.users)
      - `comment` (text)
      - `is_internal` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies for ticket viewing, creation, and updates
    - Policies for comment viewing and creation
    - Internal comments visible only to IT staff

  3. Triggers
    - Auto-update timestamps for tickets
*/

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  problem_type text NOT NULL,
  urgency text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  attachment_name text,
  attachment_url text,
  status text NOT NULL DEFAULT 'Open',
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket_comments table
CREATE TABLE IF NOT EXISTS ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  comment text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;

-- Policies for tickets
CREATE POLICY "Users can view their own tickets"
  ON tickets
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND (
    requester_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'IT_Support')
  ));

CREATE POLICY "Users can create tickets"
  ON tickets
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "IT Support can update any ticket"
  ON tickets
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'IT_Support'));

-- Policies for comments
CREATE POLICY "Users can view non-internal comments on their tickets"
  ON ticket_comments
  FOR SELECT
  USING (
    (NOT is_internal AND ticket_id IN (
      SELECT id FROM tickets WHERE requester_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )) OR
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'IT_Support')
  );

CREATE POLICY "Users can comment on their tickets"
  ON ticket_comments
  FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM tickets WHERE requester_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    ) OR
    auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'IT_Support')
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for tickets
CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();