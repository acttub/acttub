import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const tables = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name
`;

console.log("tables:");
for (const r of tables) console.log(" -", r.table_name);

const ext = await sql`SELECT extname FROM pg_extension WHERE extname = 'pg_trgm'`;
console.log("\npg_trgm:", ext.length > 0 ? "installed ✓" : "MISSING ✗");

const idx = await sql`
  SELECT indexname FROM pg_indexes
  WHERE schemaname = 'public' AND indexname = 'videos_title_trgm_idx'
`;
console.log("trgm index:", idx.length > 0 ? "exists ✓" : "MISSING ✗");

await sql.end();
