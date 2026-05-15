const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAdmin() {
  const email = 'dcastropedraza45@gmail.com';
  console.log(`Buscando el usuario ${email}...`);

  // 1. Obtener el usuario por email usando admin auth api
  const { data: usersData, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error al obtener usuarios:', authError.message);
    return;
  }

  const user = usersData.users.find(u => u.email === email);
  
  if (!user) {
    console.error(`El usuario con el correo ${email} no se encontro en Auth.`);
    return;
  }

  const userId = user.id;
  console.log(`✅ Usuario encontrado. UUID: ${userId}`);

  // 2. Insertar o actualizar en admin_users
  const { data, error } = await supabase
    .from('admin_users')
    .upsert({
      id: userId,
      email: email,
      restaurants: [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333'
      ],
      role: 'admin'
    });

  if (error) {
    console.error('❌ Error al asignar el rol de administrador:', error.message);
  } else {
    console.log(`🎉 ¡Éxito! El correo ${email} ahora tiene acceso total de administrador al panel.`);
  }
}

addAdmin();
