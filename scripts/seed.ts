import { db, schema } from "../src/lib/db";
import { FIXTURE_ROOMS } from "../src/lib/db/fixtures";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set — refusing to seed.");
    process.exit(1);
  }

  console.log(`Seeding ${FIXTURE_ROOMS.length} rooms…`);

  // 이미 있으면 slug 충돌 — onConflict 로 무시
  for (const r of FIXTURE_ROOMS) {
    await db
      .insert(schema.rooms)
      .values({
        slug: r.slug,
        name: r.name,
        region: r.region,
        subway: r.subway,
        lat: r.lat,
        lng: r.lng,
        priceHour: r.priceHour,
        priceNote: r.priceNote,
        hours: r.hours,
        phone: r.phone,
        bookingUrl: r.bookingUrl,
        photos: r.photos,
        mirror: r.mirror,
        soundproof: r.soundproof,
        sizePyeong: r.sizePyeong,
        lighting: r.lighting,
        scriptstand: r.scriptstand,
        microphone: r.microphone,
        verifiedAt: r.verifiedAt,
        active: r.active,
      })
      .onConflictDoNothing({ target: schema.rooms.slug });
    console.log(`  ✓ ${r.slug}`);
  }

  const count = await db.select().from(schema.rooms);
  console.log(`Total rooms in DB: ${count.length}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
