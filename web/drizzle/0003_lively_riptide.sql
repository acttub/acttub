CREATE TABLE "coach_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pipeline" text NOT NULL,
	"category" text NOT NULL,
	"intent" text NOT NULL,
	"start_time" double precision,
	"end_time" double precision,
	"file_name" text,
	"mime_type" text,
	"blob_url" text,
	"blob_pathname" text,
	"size_bytes" bigint,
	"feedback" jsonb NOT NULL,
	"trace" jsonb
);
