import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

/* All tables, in any order — CASCADE handles the foreign keys. */
const TABLES = [
  "User",
  "Plan",
  "Subscription",
  "Invoice",
  "Payment",
  "PaymentMethod",
  "ContactMessage",
  "Project",
  "Milestone",
  "Deliverable",
  "DeliverableVersion",
  "Comment",
  "Folder",
  "FileAsset",
  "Lead",
  "SupportTicket",
  "ActivityEvent",
];

async function main() {
  console.log("Clearing all data…");
  // Quote each identifier: `User` is a reserved word, so `TRUNCATE TABLE User`
  // is a syntax error — it must be `TRUNCATE TABLE "User", …`.
  const quoted = TABLES.map((t) => `"${t}"`).join(", ");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quoted} CASCADE`);
  console.log("✓ all tables cleared");

  // After a wipe there are no accounts, so an admin can't log in. If
  // BOOTSTRAP_ADMIN_EMAIL is set, create a single admin account so the studio
  // stays reachable. Password comes from BOOTSTRAP_ADMIN_PASSWORD or is
  // generated and printed once — change it after first login.
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  if (email) {
    const password =
      process.env.BOOTSTRAP_ADMIN_PASSWORD || randomBytes(9).toString("base64url");
    await prisma.user.upsert({
      where: { email },
      update: { role: "admin", emailVerified: true },
      create: {
        name: process.env.BOOTSTRAP_ADMIN_NAME || "FOR1S Owner",
        email,
        password: await bcrypt.hash(password, 10),
        provider: "credentials",
        role: "admin",
        emailVerified: true,
      },
    });
    console.log(`✓ admin created: ${email} (change the password after first login)`);
    console.log(`  password: ${password}`);
  } else {
    console.log("ℹ no BOOTSTRAP_ADMIN_EMAIL set — no account created");
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
