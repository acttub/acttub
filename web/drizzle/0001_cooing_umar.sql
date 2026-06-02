CREATE TABLE "acti_survey_responses" (
	"id" text PRIMARY KEY NOT NULL,
	"result_code" text NOT NULL,
	"answers" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
