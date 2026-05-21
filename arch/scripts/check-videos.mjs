import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

const videos = await sql`
  SELECT v.id, v.title, v.blob_url, v.thumbnail_url, v.created_at, u.username
  FROM videos v
  JOIN users u ON u.id = v.user_id
  ORDER BY v.created_at DESC
  LIMIT 10
`;

console.log("recent videos:");
for (const v of videos) {
  console.log(` - ${v.id.slice(0, 8)}.. @${v.username} "${v.title}" (${v.created_at.toISOString()})`);
  console.log(`   blob: ${v.blob_url}`);
}

const userCount = await sql`SELECT COUNT(*)::int AS c FROM users`;
console.log(`\nusers total: ${userCount[0].c}`);

await sql.end();
