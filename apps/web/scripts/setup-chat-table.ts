import { prisma } from "../lib/prisma";

async function main() {
  console.log("Setting up chat_inquiries table in database...");

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "chat_inquiries" (
      "id" SERIAL PRIMARY KEY,
      "session_id" VARCHAR(100) NOT NULL,
      "customer_id" INTEGER,
      "user_name" VARCHAR(150),
      "user_email" VARCHAR(150),
      "user_phone" VARCHAR(50),
      "role" VARCHAR(20) NOT NULL DEFAULT 'user',
      "message" TEXT NOT NULL,
      "topic" VARCHAR(100),
      "metadata" JSONB,
      "created_at" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "chat_inquiries_session_id_idx" ON "chat_inquiries"("session_id");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "chat_inquiries_customer_id_idx" ON "chat_inquiries"("customer_id");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "chat_inquiries_created_at_idx" ON "chat_inquiries"("created_at");
  `);

  console.log("chat_inquiries table created and indexed successfully!");
}

main()
  .catch((e) => {
    console.error("Error setting up chat table:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

