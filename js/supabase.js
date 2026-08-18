const SUPABASE_URL =
    "https://vqfvvsxuhjovjhlwuqsw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gs8ZcU1XbPiD_F5uFB88wA_r0X2MfAy";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);