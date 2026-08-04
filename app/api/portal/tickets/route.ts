import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/portal";
import { NextResponse } from "next/server";
import { z } from "zod";

const ticketSchema = z.object({
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(120),
  message: z.string().trim().min(5, "Tell us a little more").max(4000),
});

export async function POST(req: Request) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = ticketSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user.id,
      subject: parsed.data.subject,
      message: parsed.data.message,
    },
  });

  return NextResponse.json({ success: true, ticket }, { status: 201 });
}
