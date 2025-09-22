import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hsyvpqowoyrdnhapbtvz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeXZwcW93b3lyZG5oYXBidHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1MzA5NzQsImV4cCI6MjA3NDEwNjk3NH0.-Dj3ePsPF9SGtgpMrs4_LEDxSJZTuM4K1njQe-8Taxw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
