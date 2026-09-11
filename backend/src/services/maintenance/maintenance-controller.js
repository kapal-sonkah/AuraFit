import { hashPassword } from '../../security/password.js';
import UserRepositories from '../users/repositories/user-repositories.js';
import response from '../../utils/response.js';

const MAX_USERS_PER_RUN = 100;

export async function backfillPasswordHashes(req, res, next) {
  try {
    const users = await UserRepositories.getLegacyPasswordUsers(MAX_USERS_PER_RUN);
    let migrated = 0;

    for (const user of users) {
      const passwordHash = await hashPassword(user.password, { allowShort: true });
      const changed = await UserRepositories.replaceLegacyPassword(
        user.id,
        user.password,
        passwordHash,
      );
      if (changed) migrated += 1;
    }

    return response(res, 200, 'Migrasi hash kata sandi selesai', {
      migrated,
      pending: users.length === MAX_USERS_PER_RUN,
    });
  } catch (error) {
    return next(error);
  }
}
