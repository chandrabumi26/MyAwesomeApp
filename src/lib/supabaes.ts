import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxqpuiwqiteeqrqvomdi.supabase.co';
const supabaseAnonKey = 'sb_publishable_Erk2Ht1LQa1ehYSMh-mt3A_s5Sj4bq6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);