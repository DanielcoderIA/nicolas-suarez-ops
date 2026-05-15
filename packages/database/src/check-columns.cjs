
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkColumns() {
  const { data, error } = await supabase.from('menu_items').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Columnas detectadas:', Object.keys(data[0] || {}));
  }
}

checkColumns();
