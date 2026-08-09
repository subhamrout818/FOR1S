import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

/** POST /api/auth/logout — expire the httpOnly session cookie. */
export async function POST() {
  return clearSessionCookie(NextResponse.json({ success: true }));
}
