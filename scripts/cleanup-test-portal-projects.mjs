import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const retained = { id: "cmvus2ara0001l908n2mmpvoi", name: "MOOTKU CAFÉ", clientId: "cmsm29d5m0000a2f4ct67dpag", value: 3500 };
const tests = [
  { id: "cmvtjefkz0001l1085bfhry4z", name: "ILoveELSA", clientId: "cmsm29d5m0000a2f4ct67dpag", value: 2399 },
  { id: "cmvdg1z5o0001jt07482eczab", name: "valorant", clientId: "cmv1qukc40005k4062drogjsp", value: null },
  { id: "cmv2keulq0003jv06vkxe80ed", name: "HAZE IS BOY", clientId: "cmv1qqrvu0000k406fbml32at", value: null },
  { id: "cmv2ffuzb0001l9068zsun743", name: "COUNTER-STRIKE-2", clientId: "cmv1qqrvu0000k406fbml32at", value: null },
  { id: "cmtckr3oj0006a2gcfk5eejy7", name: "Brew & Co. Website", clientId: "cmsm29d5m0000a2f4ct67dpag", value: 2900 },
  { id: "cmtckr4wk000sa2gctp1gijym", name: "Brew & Co. Brand Identity", clientId: "cmsm29d5m0000a2f4ct67dpag", value: 1400 },
  { id: "cmv1acrnv0001i806msd3zlpp", name: "meridian", clientId: "cmsm29d5m0000a2f4ct67dpag", value: null },
  { id: "cmtckr5n1001aa2gcmqyb5thd", name: "Brew & Co. Care Plan", clientId: "cmsm29d5m0000a2f4ct67dpag", value: 1440 },
];
const invoicesExpected = [
  { id: "cmtckr6kj001na2gcs7p7kmkr", number: "INV-001", amount: 1450, projectId: "cmtckr3oj0006a2gcfk5eejy7" },
  { id: "cmtckr6o2001pa2gckr4s5jn8", number: "INV-002", amount: 1450, projectId: "cmtckr3oj0006a2gcfk5eejy7" },
  { id: "cmtckr6px001ra2gc3qv731ve", number: "INV-003", amount: 700, projectId: "cmtckr4wk000sa2gctp1gijym" },
  { id: "cmtckr6rn001ta2gcfkwu2q7f", number: "INV-004", amount: 700, projectId: "cmtckr4wk000sa2gctp1gijym" },
  { id: "cmtckr6tf001va2gco25aksv3", number: "INV-005", amount: 120, projectId: "cmtckr5n1001aa2gcmqyb5thd" },
];
const paymentsExpected = [
  { id: "cmtckr6v8001wa2gcxkfplbfw", invoiceId: "cmtckr6kj001na2gcs7p7kmkr", amount: 1450, reference: "TR-882140" },
  { id: "cmtckr6v8001xa2gcb10zprk3", invoiceId: "cmtckr6px001ra2gc3qv731ve", amount: 700, reference: "SIM-550912" },
  { id: "cmtckr6v8001ya2gc9n4deigj", invoiceId: "cmtckr6tf001va2gco25aksv3", amount: 120, reference: "SIM-601118" },
];
const deliverableIds = [
  "cmtckr3ok000la2gcoxeb2u20", "cmtckr3ok000ba2gct3u85734",
  "cmtckr5n1001ea2gcwr0g36rk", "cmtckr5n1001ga2gcbud5l883",
  "cmtckr4wk0016a2gcoyaw33a1", "cmtckr4wk000wa2gclzr3iu0c",
  "cmtckr4wk0010a2gcy9tt4ksd", "cmtckr3ok000ha2gctqidsf62",
  "cmtckr3ok000na2gchb8ea9n3",
];
const testIds = tests.map((p) => p.id);
const allProjectIds = [retained.id, ...testIds];
const invoiceIds = invoicesExpected.map((i) => i.id);
const paymentIds = paymentsExpected.map((p) => p.id);

function assertOk(ok, message) {
  if (!ok) throw new Error("Cleanup preflight failed: " + message);
}
function money(value) {
  return value == null ? null : Number(value.toString());
}
function sameIds(actual, expected) {
  const a = [...actual].sort();
  const e = [...expected].sort();
  return a.length === e.length && a.every((value, index) => value === e[index]);
}
async function inspect(db) {
  const [projects, invoices, payments, deliverables, files] = await Promise.all([
    db.project.findMany({ select: { id: true, name: true, clientId: true, value: true } }),
    db.invoice.findMany({ where: { projectId: { in: testIds } }, select: { id: true, number: true, amount: true, projectId: true, userId: true } }),
    db.payment.findMany({ where: { invoiceId: { in: invoiceIds } }, select: { id: true, invoiceId: true, amount: true, reference: true } }),
    db.deliverable.findMany({ where: { projectId: { in: testIds } }, select: { id: true, projectId: true } }),
    db.fileAsset.findMany({ where: { projectId: { in: testIds } }, select: { id: true, name: true, url: true, size: true, projectId: true } }),
  ]);
  return { projects, invoices, payments, deliverables, files };
}
function validate(data) {
  assertOk(sameIds(data.projects.map((p) => p.id), allProjectIds), "the live project set differs from the nine audited records");
  const keep = data.projects.find((p) => p.id === retained.id);
  assertOk(keep?.name === retained.name && keep.clientId === retained.clientId && money(keep.value) === retained.value, "the retained Mootku Café project changed or is missing");
  for (const expected of tests) {
    const actual = data.projects.find((p) => p.id === expected.id);
    assertOk(actual && actual.name === expected.name && actual.clientId === expected.clientId && money(actual.value) === expected.value, "test project changed: " + expected.name);
  }
  assertOk(data.invoices.length === invoicesExpected.length, "the invoice set linked to test projects differs from the audited five");
  for (const expected of invoicesExpected) {
    const actual = data.invoices.find((i) => i.id === expected.id);
    assertOk(actual && actual.number === expected.number && money(actual.amount) === expected.amount && actual.projectId === expected.projectId && actual.userId === retained.clientId, "invoice changed: " + expected.number);
  }
  assertOk(sameIds(data.payments.map((p) => p.id), paymentIds), "payment records linked to test invoices differ from the audited three");
  for (const expected of paymentsExpected) {
    const actual = data.payments.find((p) => p.id === expected.id);
    assertOk(actual && actual.invoiceId === expected.invoiceId && money(actual.amount) === expected.amount && actual.reference === expected.reference, "payment changed: " + expected.id);
  }
  assertOk(sameIds(data.deliverables.map((d) => d.id), deliverableIds), "deliverables linked to test projects differ from the audited nine");
  assertOk(data.files.every((file) => file.url === "#"), "a test-project file points to real/external storage; reconcile it before deleting");
  return {
    projectsToDelete: tests.length,
    invoicesToDelete: data.invoices.length,
    paymentsToDelete: data.payments.length,
    deliverablesToCascade: data.deliverables.length,
    fileRecordsToCascade: data.files.length,
    placeholderFiles: data.files.map((file) => ({ name: file.name, sizeBytes: file.size })),
    retainedProject: retained.name,
    preserved: ["all client user accounts", "all support tickets", "all leads", "all invoices not linked to the eight test projects"],
    cascade: ["milestones", "deliverables", "deliverable versions", "comments", "folders", "placeholder file records", "project activity"],
  };
}
async function main() {
  const execute = process.argv.includes("--execute");
  if (execute) {
    assertOk(process.env.CONFIRM_PORTAL_TEST_CLEANUP === "delete-only-the-eight-verified-test-projects", "missing exact CONFIRM_PORTAL_TEST_CLEANUP guard");
    assertOk(process.env.ALLOW_PRODUCTION_TEST_CLEANUP === "1", "set ALLOW_PRODUCTION_TEST_CLEANUP=1 only after reviewing the dry run on the intended database");
  }
  const summary = validate(await inspect(prisma));
  console.log(JSON.stringify({ mode: execute ? "EXECUTE" : "DRY RUN", summary }, null, 2));
  if (!execute) {
    console.log("Dry run only. No database records were changed.");
    return;
  }
  const result = await prisma.$transaction(async (tx) => {
    validate(await inspect(tx)); // Revalidate within the transaction before any mutation.
    const paymentDelete = await tx.payment.deleteMany({ where: { id: { in: paymentIds } } });
    const invoiceDelete = await tx.invoice.deleteMany({ where: { id: { in: invoiceIds }, projectId: { in: testIds } } });
    const projectDelete = await tx.project.deleteMany({ where: { id: { in: testIds } } });
    assertOk(paymentDelete.count === paymentsExpected.length, "payment delete count mismatch");
    assertOk(invoiceDelete.count === invoicesExpected.length, "invoice delete count mismatch");
    assertOk(projectDelete.count === tests.length, "project delete count mismatch");
    const protectedProject = await tx.project.findUnique({ where: { id: retained.id }, select: { id: true, name: true } });
    assertOk(protectedProject?.name === retained.name, "Mootku Café did not survive the cleanup");
    return {
      paymentsDeleted: paymentDelete.count,
      invoicesDeleted: invoiceDelete.count,
      projectsDeleted: projectDelete.count,
      retainedProject: protectedProject.name,
    };
  });
  console.log(JSON.stringify({ completed: true, result }, null, 2));
}
main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "Cleanup failed");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
