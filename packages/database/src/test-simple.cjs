
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const restaurantId = '11111111-1111-1111-1111-111111111111';

async function testSimpleInsert() {
  const { error } = await supabase
    .from('menu_items')
    .insert([
      { restaurant_id: restaurantId, name: 'Test Item', price: 1000, category: 'entradas' }
    ]);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('✓ Inserción simple exitosa. La tabla base está operativa.');
  }
}

testSimpleInsert();
