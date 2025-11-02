// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Atau ganti '*' dengan URL Vercel Anda nanti
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}