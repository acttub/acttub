import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForPg = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://placeholder:placeholder@127.0.0.1:5432/_unset";

const client =
  globalForPg.pgClient ??
  postgres(connectionString, {
    max: 1,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") globalForPg.pgClient = client;

export const db = drizzle(client, { schema });
export { schema };
export type { Room, NewRoom, Hours } from "./schema";

export const isDbConfigured =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("_unset");
