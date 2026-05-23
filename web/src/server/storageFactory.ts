import { createDb, createPostgresActtubStorage, selectStorageBackend } from './postgresStorage';
import { createMemoryActtubStorage } from './storage';

export function createActtubStorage(env: Partial<Pick<NodeJS.ProcessEnv, 'DATABASE_URL'>> = process.env) {
  if (selectStorageBackend(env) === 'postgres') {
    return createPostgresActtubStorage(createDb(env.DATABASE_URL!));
  }
  return createMemoryActtubStorage();
}
