CREATE TABLE "archive_videos" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"thumbnail_url" text,
	"duration_sec" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"visibility" text DEFAULT 'public' NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"user_username" text NOT NULL,
	"user_display_name" text NOT NULL,
	"user_avatar_url" text,
	"blob_url" text,
	"blob_pathname" text,
	"mime_type" text,
	"size_bytes" bigint
);
--> statement-breakpoint
CREATE TABLE "community_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"parent_id" text,
	"body" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"author_id" text NOT NULL,
	"author_username" text NOT NULL,
	"author_display_name" text NOT NULL,
	"author_avatar_url" text,
	"anonymous" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"author_id" text NOT NULL,
	"author_username" text NOT NULL,
	"author_display_name" text NOT NULL,
	"author_avatar_url" text,
	"anonymous" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;
