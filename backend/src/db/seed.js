const sqlite = require('./sqlite');
const bcrypt = require('bcryptjs');

async function runSeed() {
  const db = await sqlite.getDb();

  // criar admin, staff e client com senhas hash
  const adminPass = await bcrypt.hash('admin123', 10);
  const staffPass = await bcrypt.hash('staff123', 10);
  const clientPass = await bcrypt.hash('client123', 10);

  await db.run(`INSERT OR IGNORE INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`,
    ['admin@leidycleaner.com', adminPass, 'Administrador', '51980000000', 'admin']);

  await db.run(`INSERT OR IGNORE INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`,
    ['staff1@leidycleaner.com', staffPass, 'Funcionária 1', '51981111111', 'staff']);

  await db.run(`INSERT OR IGNORE INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)`,
    ['cliente1@leidycleaner.com', clientPass, 'Cliente 1', '51982222222', 'client']);

  console.log('Seed executado com sucesso');
}

if (require.main === module) runSeed().catch(err => { console.error(err); process.exit(1); });

module.exports = runSeed;
