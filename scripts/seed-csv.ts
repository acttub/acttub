import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { db, schema } from "../src/lib/db";
import type { NewRoom } from "../src/lib/db/schema";

type CsvRow = Record<string, string>;

function toBool(v: string): boolean {
  return ["true", "1", "y", "yes", "TRUE"].includes(v.trim());
}

function toEnum<T extends string>(v: string, allowed: readonly T[], fallback: T): T {
  const trimmed = v.trim() as T;
  return allowed.includes(trimmed) ? trimmed : fallback;
}

function splitList(v: string): string[] {
  if (!v) return [];
  return v
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseRow(row: CsvRow, i: number): NewRoom {
  const errors: string[] = [];
  const required = ["slug", "name", "region", "lat", "lng", "price_hour", "open_time", "close_time", "days", "phone", "size_pyeong"];
  for (const k of required) {
    if (!row[k] || row[k].trim() === "") errors.push(`missing ${k}`);
  }
  if (errors.length > 0) {
    throw new Error(`Row ${i + 2}: ${errors.join(", ")}`);
  }

  return {
    slug: row.slug.trim(),
    name: row.name.trim(),
    region: row.region.trim(),
    subway: splitList(row.subway ?? ""),
    lat: Number(row.lat),
    lng: Number(row.lng),
    priceHour: Number(row.price_hour),
    priceNote: row.price_note?.trim() || null,
    hours: {
      open: row.open_time.trim(),
      close: row.close_time.trim(),
      days: splitList(row.days).map(Number).filter((n) => !Number.isNaN(n)),
    },
    phone: row.phone.trim(),
    bookingUrl: row.booking_url?.trim() || null,
    photos: splitList(row.photos ?? ""),
    mirror: toBool(row.mirror ?? "false"),
    soundproof: toEnum(row.soundproof ?? "medium", ["strong", "medium", "weak"] as const, "medium"),
    sizePyeong: Number(row.size_pyeong),
    lighting: toEnum(row.lighting ?? "normal", ["bright", "normal", "dim", "none"] as const, "normal"),
    scriptstand: toBool(row.scriptstand ?? "false"),
    microphone: toBool(row.microphone ?? "false"),
    active: row.active === undefined || row.active === "" ? true : toBool(row.active),
  };
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const csvPath = process.argv[2] ?? "scripts/seed-rooms.csv";
  const absPath = path.resolve(csvPath);

  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    console.error(`Usage: pnpm seed:csv [path/to/file.csv]`);
    console.error(`Default path: scripts/seed-rooms.csv`);
    console.error(`Example template: scripts/seed-rooms.example.csv`);
    process.exit(1);
  }

  console.log(`Reading ${absPath}`);
  const content = fs.readFileSync(absPath, "utf-8");
  const rows: CsvRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  });

  console.log(`Parsed ${rows.length} rows`);

  let ok = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    try {
      const data = parseRow(rows[i], i);
      const result = await db
        .insert(schema.rooms)
        .values(data)
        .onConflictDoUpdate({
          target: schema.rooms.slug,
          set: {
            ...data,
            updatedAt: new Date(),
          },
        })
        .returning({ slug: schema.rooms.slug });
      if (result[0]) {
        console.log(`  ✓ ${result[0].slug}`);
        ok++;
      } else {
        skipped++;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  ✗ ${msg}`);
      failed.push(msg);
    }
  }

  console.log("");
  console.log(`Upserted: ${ok}  |  Skipped: ${skipped}  |  Failed: ${failed.length}`);
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
