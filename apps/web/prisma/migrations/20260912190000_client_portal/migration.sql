CREATE TABLE "planning_profiles" (
  "id" SERIAL NOT NULL, "customer_id" INTEGER NOT NULL, "partner_name" VARCHAR(150), "vision" TEXT,
  "ceremony_style" VARCHAR(150), "priorities" TEXT, "preferred_date" DATE, "preferred_city" VARCHAR(100),
  "guest_target" INTEGER, "budget_target" DECIMAL(15,2), "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "planning_profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "planning_profiles_customer_id_key" ON "planning_profiles"("customer_id");
CREATE TABLE "expenses" (
  "id" SERIAL NOT NULL, "event_id" INTEGER, "customer_id" INTEGER NOT NULL, "title" VARCHAR(200) NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL, "category" VARCHAR(100), "receipt_data_url" TEXT, "spent_at" DATE,
  "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "expenses_customer_id_idx" ON "expenses"("customer_id");
CREATE INDEX "expenses_event_id_idx" ON "expenses"("event_id");
CREATE TABLE "media_assets" (
  "id" SERIAL NOT NULL, "event_id" INTEGER, "customer_id" INTEGER NOT NULL, "name" VARCHAR(255) NOT NULL,
  "data_url" TEXT NOT NULL, "content_type" VARCHAR(100), "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "media_assets_customer_id_idx" ON "media_assets"("customer_id");
CREATE INDEX "media_assets_event_id_idx" ON "media_assets"("event_id");
CREATE TABLE "meeting_notes" (
  "id" SERIAL NOT NULL, "event_id" INTEGER, "customer_id" INTEGER NOT NULL, "title" VARCHAR(200) NOT NULL,
  "provider" VARCHAR(50), "meeting_at" TIMESTAMP(0), "notes" TEXT NOT NULL,
  "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "meeting_notes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "meeting_notes_customer_id_idx" ON "meeting_notes"("customer_id");
CREATE INDEX "meeting_notes_event_id_idx" ON "meeting_notes"("event_id");
ALTER TABLE "planning_profiles" ADD CONSTRAINT "fk_planning_profile_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "expenses" ADD CONSTRAINT "fk_expense_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "expenses" ADD CONSTRAINT "fk_expense_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "media_assets" ADD CONSTRAINT "fk_media_asset_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "media_assets" ADD CONSTRAINT "fk_media_asset_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
ALTER TABLE "meeting_notes" ADD CONSTRAINT "fk_meeting_note_customer" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "meeting_notes" ADD CONSTRAINT "fk_meeting_note_event" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
