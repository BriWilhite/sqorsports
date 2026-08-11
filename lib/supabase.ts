import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cvrzieobtvakfiqgouhw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cnppZW9idHZha2ZpcXFvdWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzNjkyMjcsImV4cCI6MjAyMjIxMjgzMH0.KXZhfVlY68C9Tuxd54ELhvmn_NhQBX25iw8taEflj3A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)