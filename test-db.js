import prisma from './admin-panel/admin-panel/backend/src/config/database.js';

async function test() {
  const dummyReporter = "00000000-0000-0000-0000-000000000011";
  const dummyReported = "00000000-0000-0000-0000-000000000022";

  try {
    // 1. Create dummy users if not exist (quick insert to satisfy foreign constraints)
    await prisma.user.upsert({
      where: { id: dummyReporter },
      update: {},
      create: { id: dummyReporter, email: "reporter@test.com" }
    });
    await prisma.user.upsert({
      where: { id: dummyReported },
      update: {},
      create: { id: dummyReported, email: "reported@test.com" }
    });

    // 2. Insert report 1
    await prisma.report.create({
      data: { reportedUserId: dummyReported, reportedBy: dummyReporter, reason: "Spam" }
    });
    console.log("First report inserted successfully!");

    // 3. Insert duplicate
    await prisma.report.create({
      data: { reportedUserId: dummyReported, reportedBy: dummyReporter, reason: "Test duplicate" }
    });

  } catch (e) {
    console.log("DUPLICATE ERROR CODE:", e.code);
    console.log("DUPLICATE ERROR NAME:", e.name);
    console.log("FULL ERROR TYPE:", typeof e, e.constructor.name);
  } finally {
    // Cleanup
    await prisma.report.deleteMany({ where: { reportedBy: dummyReporter } });
    await prisma.user.deleteMany({ where: { id: { in: [dummyReporter, dummyReported] } } });
  }
}

test();
