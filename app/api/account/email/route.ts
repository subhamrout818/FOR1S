import { prisma } from "@/lib/prisma";
import { getAuthUserWithPassword } from "@/lib/authed-user";
import { comparePassword } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const changeEmailSchema = z.object({
  email: z.email("Invalid email address"),
  currentPassword: z.string().min(1, "Current password is required"),
});

/**
 * POST /api/account/email — change the signed-in user's email, requiring
 * their current password to confirm.
 */
export async function POST(req: Request) {
  try {
    const user = await getAuthUserWithPassword(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Passwordless (OAuth) accounts can't confirm with a password.
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your account has no password. Use 'Forgot password' to create one before changing your email.",
        },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = changeEmailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, currentPassword } = result.data;

    // Confirm it's really them before touching the login identifier.
    const passwordOk = await comparePassword(currentPassword, user.password);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== user.id) {
      return NextResponse.json(
        { success: false, message: "That email is already in use" },
        { status: 409 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { email },
      select: { id: true, name: true, email: true, profileImage: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
