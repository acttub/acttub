import { createDb, createPostgresActtubStorage, selectStorageBackend } from './postgresStorage';
import { createMemoryActtubStorage } from './storage';

export function createActtubStorage(env: { DATABASE_URL?: string } = { DATABASE_URL: process.env.DATABASE_URL }) {
  if (selectStorageBackend(env) === 'postgres') {
    return createPostgresActtubStorage(createDb(env.DATABASE_URL!));
  }
  return createMemoryActtubStorage();
}
