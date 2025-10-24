CREATE TABLE "system_health" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"message" text,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
