import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "won", "lost"]),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = leadSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  }).catch(() => null);

  if (!lead) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, status: lead.status });
}
