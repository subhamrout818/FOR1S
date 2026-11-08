import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  source: z.enum(["manual", "referral", "instagram", "website", "other"]).default("manual"),
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]).default("new"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

/** POST /api/admin/leads — create a lead manually from the admin pipeline. */
export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = createLeadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors, message: "Check the lead details and try again." },
      { status: 400 }
    );
  }

  const { name, email, company, phone, service, budget, source, status, notes } = parsed.data;
  try {
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company: company || null,
        phone: phone || null,
        service: service || null,
        budget: budget || null,
        source,
        status,
        notes: notes || null,
      },
      select: { id: true },
    });
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error("admin lead creation failed:", error);
    return NextResponse.json({ success: false, message: "Couldn't create this lead. Please try again." }, { status: 500 });
  }
}
