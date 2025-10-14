ALTER TABLE "notes" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "is_deleted" boolean DEFAULT false;