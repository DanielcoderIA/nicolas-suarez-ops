const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Test con Service Key para ver si la fila existe
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdmin() {
  const userId = 'c4d286d9-2a07-4d87-b354-d84ef2376712';
  
  // 1. Ver si existe la fila
  const { data: adminRow, error } = await adminSupabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error("Error al buscar la fila con service_role:", error.message);
  } else {
    console.log("Fila encontrada en admin_users:", adminRow);
  }
}

testAdmin();
