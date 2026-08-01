import { prisma } from "@/lib/prisma";
import {
  consumeRateLimit,
  clientIp,
  rateLimitedResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { CONTACT } from "@/lib/contact";
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
 * POST /api/contact — persist an inquiry from the contact page and, when an
 * email provider is configured, notify the business email so the inquiry
 * isn't just sitting in the database.
 *
 * Email is optional: it only sends if `RESEND_API_KEY` is set. Without it the
 * message is still saved and the API returns success.
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

    // Notify the business email when a provider is configured.
    let emailed = false;
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const to = process.env.CONTACT_NOTIFY_EMAIL || CONTACT.contactEmail;
        const from =
          process.env.RESEND_FROM || "FOR1S Contact <onboarding@resend.dev>";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            replyTo: email,
            subject: `New inquiry from ${name}`,
            text: [
              `Name: ${name}`,
              `Email: ${email}`,
              `Company: ${company || "—"}`,
              `Project type: ${projectType || "—"}`,
              `Budget: ${budget || "—"}`,
              "",
              message,
            ].join("\n"),
          }),
        });
        emailed = res.ok;
        if (!emailed) {
          console.error("contact email failed:", await res.text());
        }
      } catch (error) {
        console.error("contact email error:", error);
      }
    }

    return NextResponse.json({ success: true, id: created.id, emailed });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
