import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hgtrogjnhqggvtgddgsf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndHJvZ2puaHFnZ3Z0Z2RkZ3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDU4ODgsImV4cCI6MjA5NTcyMTg4OH0.yxUrTXDTw5HUgPxOoB4viEvTZrYBLyGTkIXqA0W2kvI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);