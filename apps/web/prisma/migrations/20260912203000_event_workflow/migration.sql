ALTER TABLE "consultations" ADD COLUMN "meeting_provider" VARCHAR(30);
ALTER TABLE "consultations" ADD COLUMN "meeting_url" TEXT;
ALTER TABLE "consultations" ADD COLUMN "duration_minutes" INTEGER DEFAULT 30;
CREATE TABLE "event_requirements" (
  "id" SERIAL NOT NULL,
  "event_id" INTEGER NOT NULL,
  "content" JSONB NOT NULL,
  "status" VARCHAR(30) DEFAULT 'DRAFT',
  "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "event_requirements_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "event_requirements_event_id_key" ON "event_requirements"("event_id");
ALTER TABLE "event_requirements" ADD CONSTRAINT "fk_event_requirements_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
