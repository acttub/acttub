import {
  pgTable,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  jsonb,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

export const soundproofEnum = pgEnum("soundproof", [
  "strong",
  "medium",
  "weak",
]);

export const lightingEnum = pgEnum("lighting", [
  "bright",
  "normal",
  "dim",
  "none",
]);

export type Hours = {
  open: string; // "09:00"
  close: string; // "24:00"
  days: number[]; // 0=Sun ~ 6=Sat
};

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),

  name: text("name").notNull(),
  region: text("region").notNull(), // 예: "종로구 동숭동"
  subway: jsonb("subway").$type<string[]>().notNull().default([]),

  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),

  priceHour: integer("price_hour").notNull(), // 원
  priceNote: text("price_note"), // "협의" 등

  hours: jsonb("hours").$type<Hours>().notNull(),

  phone: text("phone").notNull(),
  bookingUrl: text("booking_url"),

  photos: jsonb("photos").$type<string[]>().notNull().default([]),

  // 정규화 속성
  mirror: boolean("mirror").notNull().default(false),
  soundproof: soundproofEnum("soundproof").notNull().default("medium"),
  sizePyeong: integer("size_pyeong").notNull(),
  lighting: lightingEnum("lighting").notNull().default("normal"),
  scriptstand: boolean("scriptstand").notNull().default(false),
  microphone: boolean("microphone").notNull().default(false),

  verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  active: boolean("active").notNull().default(true),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
