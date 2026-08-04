import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const ticketSchema = z.object({
  status: z.enum(["open", "replied", "closed"]),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = ticketSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const ticket = await prisma.supportTicket
    .update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    })
    .catch(() => null);

  if (!ticket) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, status: ticket.status });
}
