import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrbpnamcpstxxyifuqyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYnBuYW1jcHN0eHh5aWZ1cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTIzMTAsImV4cCI6MjA2ODY2ODMxMH0.bFKU3yrduRq_XM8_39QitwmEGLa_5nD-E_uA1DeuJNo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
