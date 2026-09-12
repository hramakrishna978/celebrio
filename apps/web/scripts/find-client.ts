import "dotenv/config";
import { prisma } from "../lib/prisma";

async function findClient() {
  try {
    const clients = await prisma.customers.findMany({
      where: {
        OR: [
          { name: { contains: "Client", mode: "insensitive" } },
          { user_id: { not: null } }
        ]
      },
      include: {
        users: true,
        events: true,
      }
    });
    console.log("Found clients:", JSON.stringify(clients, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
findClient();

