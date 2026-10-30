-- Mary Help of Christians Catholic High School - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Principal', 'Vice Principal', 'Dean of Student Affairs', 'Finance Office', 'Teachers', 'Staff', 'Student Leaders', 'Students', 'Parents')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Students Entity
CREATE TABLE IF NOT EXISTS public.students (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  class_id TEXT NOT NULL,
  admission_no TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Alumni')),
  parent_id TEXT
);

-- 4. Parents Entity
CREATE TABLE IF NOT EXISTS public.parents (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  phone TEXT,
  address TEXT,
  child_ids TEXT[] DEFAULT '{}'
);

-- 5. Teachers Entity
CREATE TABLE IF NOT EXISTS public.teachers (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  designation TEXT,
  qualifications TEXT,
  subjects TEXT[] DEFAULT '{}'
);

-- 6. Staff Entity
CREATE TABLE IF NOT EXISTS public.staff (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  department TEXT,
  tasks TEXT[] DEFAULT '{}'
);

-- 7. School Classes
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  adviser_id TEXT
);

-- 8. Academic Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id TEXT
);

-- 9. Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  student_id TEXT NOT NULL,
  class_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  remarks TEXT DEFAULT ''
);

-- 10. Academic Exam Results
CREATE TABLE IF NOT EXISTS public.results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  exam_term TEXT NOT NULL CHECK (exam_term IN ('First Period', 'Mid Term', 'Finals')),
  score NUMERIC NOT NULL,
  max_score NUMERIC DEFAULT 100,
  grade TEXT NOT NULL,
  teacher_remarks TEXT DEFAULT ''
);

-- 11. Finance Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Fully Paid', 'Partially Paid', 'Unpaid', 'Scholarship')),
  receipt_url TEXT,
  date DATE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  remarks TEXT,
  invoice_no TEXT
);

-- 12. Community Feed & Lounge Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  likes TEXT[] DEFAULT '{}',
  comments JSONB DEFAULT '[]'::jsonb,
  anonymous BOOLEAN DEFAULT FALSE,
  section TEXT DEFAULT 'feed' CHECK (section IN ('feed', 'lounge')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Student Clubs
CREATE TABLE IF NOT EXISTS public.clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  president_id TEXT,
  members TEXT[] DEFAULT '{}'
);

-- 14. Digital Library Resources
CREATE TABLE IF NOT EXISTS public.library_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Note', 'PDF', 'Past Exam', 'Handbook', 'Material')),
  file_url TEXT NOT NULL,
  subject_id TEXT,
  uploaded_by TEXT,
  download_count INT DEFAULT 0,
  created_at DATE DEFAULT CURRENT_DATE
);

-- 15. Student Suggestions
CREATE TABLE IF NOT EXISTS public.suggestions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Addressed')),
  date DATE DEFAULT CURRENT_DATE
);

-- 16. Catholic Prayer Requests
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT 'Anonymous Student',
  intention TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  prayers_count INT DEFAULT 1
);

-- 17. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  username TEXT,
  role TEXT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT DEFAULT '127.0.0.1',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Emergency Alerts
CREATE TABLE IF NOT EXISTS public.emergency_alerts (
  id SERIAL PRIMARY KEY,
  active BOOLEAN DEFAULT FALSE,
  message TEXT DEFAULT '',
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Initial Alert Record
INSERT INTO public.emergency_alerts (id, active, message, severity)
VALUES (1, FALSE, '', 'medium')
ON CONFLICT (id) DO NOTHING;

-- 20. Enable Row Level Security (RLS) with Permissive Demo Policies
-- (For production, policies can be restricted to authenticated Supabase JWT roles)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Allow read/write access via anon key for prototype campus operations
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN 
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public access policy" ON public.%I', tbl);
    EXECUTE format('CREATE POLICY "Public access policy" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl);
  END LOOP;
END $$;
