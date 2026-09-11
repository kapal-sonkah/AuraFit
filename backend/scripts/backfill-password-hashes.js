import dotenv from 'dotenv';

dotenv.config();

const { default: UserRepositories } = await import('../src/services/users/repositories/user-repositories.js');
const { hashPassword } = await import('../src/security/password.js');

let migrated = 0;
while (true) {
  const users = await UserRepositories.getLegacyPasswordUsers();
  if (users.length === 0) break;

  for (const user of users) {
    const passwordHash = await hashPassword(user.password, { allowShort: true });
    const changed = await UserRepositories.replaceLegacyPassword(user.id, user.password, passwordHash);
    if (changed) migrated += 1;
  }
}

await UserRepositories.pool.end();
console.log(`Migrasi hash kata sandi selesai: ${migrated} akun.`);
