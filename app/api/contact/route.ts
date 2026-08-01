import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.email("Invalid email address"),
  company: z.string().max(100).optional().nullable(),
  projectType: z.string().max(100).optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

/**
 * POST /api/contact — persist an inquiry from the contact page.
 */
export async function POST(req: Request) {
  try {
    // Public form — cap submissions per IP to slow spam.
    const limitKey = `contact:${clientIp(req)}`;
    const rate = consumeRateLimit(
      limitKey,
      RATE_LIMITS.contact.limit,
      RATE_LIMITS.contact.windowMs
    );
    if (!rate.ok) return rateLimitedResponse(rate.resetAt);

    const body = await req.json().catch(() => null);
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, company, projectType, budget, message } = result.data;

    const created = await prisma.contactMessage.create({
      data: {
        name,
        email,
        company: company ?? null,
        projectType: projectType ?? null,
        budget: budget ?? null,
        message,
      },
      select: { id: true },
    });

    return NextResponse.json({ success: true, id: created.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
