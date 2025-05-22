/*
  # Add RLS Policies for Auth Users

  1. Security
    - Enable RLS on auth.users table
    - Add policies for:
      - Users to view their own records
      - IT Support to view all records
      - IT Support to update user records
    - Ensure secure access patterns

  2. Notes
    - Uses role-based access control via user metadata
    - Follows least privilege principle
*/

-- Enable RLS on auth.users if not already enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own record
CREATE POLICY "Users can view own record"
  ON auth.users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow IT Support to view all records
CREATE POLICY "IT Support can view all records"
  ON auth.users
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id 
      FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'IT_Support'
    )
  );

-- Create policy to allow IT Support to update user records
CREATE POLICY "IT Support can update user records"
  ON auth.users
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id 
      FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'IT_Support'
    )
  );