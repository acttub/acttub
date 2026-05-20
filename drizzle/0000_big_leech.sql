CREATE TYPE "public"."lighting" AS ENUM('bright', 'normal', 'dim', 'none');--> statement-breakpoint
CREATE TYPE "public"."soundproof" AS ENUM('strong', 'medium', 'weak');--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"subway" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"price_hour" integer NOT NULL,
	"price_note" text,
	"hours" jsonb NOT NULL,
	"phone" text NOT NULL,
	"booking_url" text,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mirror" boolean DEFAULT false NOT NULL,
	"soundproof" "soundproof" DEFAULT 'medium' NOT NULL,
	"size_pyeong" integer NOT NULL,
	"lighting" "lighting" DEFAULT 'normal' NOT NULL,
	"scriptstand" boolean DEFAULT false NOT NULL,
	"microphone" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "rooms_slug_unique" UNIQUE("slug")
);
