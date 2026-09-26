import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qwnozmnrzgrdrtooqepo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bm96bW5yemdyZHJ0b29xZXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MjkxNzQsImV4cCI6MjEwMjUwNTE3NH0.6_5TKNWcBsh8v3bgRfI0nQb0n7VdQSquIPrfoEDxHP8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);