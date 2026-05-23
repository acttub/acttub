import { createDb, createPostgresActtubStorage, selectStorageBackend } from './postgresStorage.js';
import { createMemoryActtubStorage } from './storage.js';

export function createActtubStorage(env: Partial<Pick<NodeJS.ProcessEnv, 'DATABASE_URL'>> = process.env) {
  if (selectStorageBackend(env) === 'postgres') {
    return createPostgresActtubStorage(createDb(env.DATABASE_URL!));
  }
  return createMemoryActtubStorage();
}
