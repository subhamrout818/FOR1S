import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/authed-user";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * profileImage is either a canvas-generated image data URL (uploaded or
 * captured photo) or one of the bundled preset paths. Anything else is
 * rejected to avoid storing arbitrary/external URLs.
 */
const imageRef = z.union([
  z.string().regex(/^data:image\/(jpeg|png|webp);base64,/, "Unsupported image format"),
  z.string().regex(/^\/avatars\//, "Unknown avatar"),
]);

const updateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  profileImage: z.union([imageRef, z.literal("")]).optional(),
});

/**
 * PATCH /api/account — update the signed-in user's name and/or profile image.
 */
export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data: { name?: string; profileImage?: string | null } = {};
    if (result.data.name !== undefined) data.name = result.data.name;
    if (result.data.profileImage !== undefined) {
      // Empty string clears the custom image back to the default avatar.
      data.profileImage = result.data.profileImage === "" ? null : result.data.profileImage;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
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
