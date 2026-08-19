/* =========================================================
   X SPANISH — Supabase connection
   ---------------------------------------------------------
   Fill these two values in from your Supabase project:
     Dashboard > Project Settings > Data API

   Both values are safe to publish — the anon key is designed
   to sit in public frontend code, and Row Level Security (see
   supabase/schema.sql) is what actually blocks writes.

   NEVER put the "service_role" key in this file. That key
   bypasses every security rule and must stay server-side only.
   ========================================================= */

window.XS_CONFIG = {
    SUPABASE_URL: 'https://YOUR-PROJECT-REF.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR-PUBLIC-ANON-KEY',

    STORAGE_BUCKET: 'product-images',
};
