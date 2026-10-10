import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { r2Request } from "@/lib/r2-storage";
export const runtime = "nodejs";
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
 const user = await requireAuth(req);
 if (!user) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
 try {
  const {id} = await context.params;
  const file = await prisma.fileAsset.findFirst({where:{id,project:{clientId:user.id}},select:{id:true,name:true,url:true,mimeType:true}});
  if (!file) return NextResponse.json({success:false,message:"File not found"},{status:404});
  if (!file.url.startsWith("r2://")) return NextResponse.redirect(new URL(file.url,req.url),302);
  const key = file.url.slice(5);
  if (!key.startsWith(`clients/${user.id}/`)) return NextResponse.json({success:false,message:"File not found"},{status:404});
  const stored = await r2Request("GET",key);
  if (!stored.ok) return NextResponse.json({success:false,message:"File unavailable"},{status:502});
  return new Response(stored.body,{status:200,headers:{"Content-Type":file.mimeType ?? "application/octet-stream","Content-Disposition":`inline; filename="${file.name.replace(/["\\\\\r\n]/g,"_")}"`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
 } catch (error) { console.error("R2 file download error:",error); return NextResponse.json({success:false,message:"Unable to retrieve file"},{status:500}); }
}