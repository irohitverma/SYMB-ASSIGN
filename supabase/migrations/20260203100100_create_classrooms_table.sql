/*
  # Create Classrooms Table

  1. New Tables
    - `classrooms`
      - `id` (uuid, primary key) - Unique identifier for each classroom
      - `name` (text, not null) - Name/identifier of the classroom (e.g., "Room 101", "Lab A")
      - `floor` (integer, not null) - Floor number of the classroom
      - `capacity` (integer, not null) - Maximum number of seats in the classroom
      - `created_at` (timestamptz) - Timestamp of when the classroom was added

  2. Security
    - Enable RLS on `classrooms` table
    - Add policy for public read access (viewing classrooms)
    - Add policy for public insert access (adding classrooms)
    - Add policy for public update access (editing classrooms)
    - Add policy for public delete access (removing classrooms)

  Note: Public access is enabled for all operations as this is an educational management tool
  that may be used without authentication in a classroom setting.
*/

CREATE TABLE IF NOT EXISTS classrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  floor integer NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to classrooms"
  ON classrooms FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to classrooms"
  ON classrooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to classrooms"
  ON classrooms FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to classrooms"
  ON classrooms FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_classrooms_floor ON classrooms(floor);
CREATE INDEX IF NOT EXISTS idx_classrooms_capacity ON classrooms(capacity);